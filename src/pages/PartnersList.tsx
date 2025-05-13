
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Filter, ArrowDownAZ, ArrowUpZA } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Partner, companySize, sizeColorMap } from '@/types/partner';
import { getPartners, updatePartner } from '@/services/partnerService';
import { toast } from '@/components/ui/sonner';
import Logo from '@/components/Logo';

const PartnersList = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [filteredPartners, setFilteredPartners] = useState<Partner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingPartner, setEditingPartner] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partner | null>(null);
  const [filters, setFilters] = useState({
    name: '',
    size: 'all',
  });
  const [sortConfig, setSortConfig] = useState<{
    key: keyof Partner | null;
    direction: 'asc' | 'desc';
  }>({
    key: null,
    direction: 'asc',
  });

  // Fetch partners on component mount
  useEffect(() => {
    fetchPartners();
  }, []);

  // Apply filters whenever partners or filters change
  useEffect(() => {
    applyFilters();
  }, [partners, filters, sortConfig]);

  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      const fetchedPartners = await getPartners();
      setPartners(fetchedPartners);
      setFilteredPartners(fetchedPartners);
    } catch (error) {
      console.error('Failed to fetch partners:', error);
      toast.error('Erro ao carregar parceiros');
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let result = [...partners];

    // Filter by name
    if (filters.name) {
      result = result.filter(partner =>
        partner.name.toLowerCase().includes(filters.name.toLowerCase())
      );
    }

    // Filter by size
    if (filters.size && filters.size !== 'all') {
      result = result.filter(partner => partner.size === filters.size);
    }

    // Apply sorting if set
    if (sortConfig.key) {
      result.sort((a, b) => {
        // Get the values to compare
        const aValue = a[sortConfig.key as keyof Partner];
        const bValue = b[sortConfig.key as keyof Partner];
        
        // Handle string comparison
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return sortConfig.direction === 'asc' 
            ? aValue.localeCompare(bValue) 
            : bValue.localeCompare(aValue);
        }
        
        // Handle number comparison
        if (typeof aValue === 'number' && typeof bValue === 'number') {
          return sortConfig.direction === 'asc' 
            ? aValue - bValue 
            : bValue - aValue;
        }
        
        // Default comparison for other types
        if (aValue < bValue) {
          return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
      });
    }

    setFilteredPartners(result);
  };

  const handleSort = (key: keyof Partner) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    
    setSortConfig({ key, direction });
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  const startEditing = (partner: Partner) => {
    setEditingPartner(partner.id || null);
    setEditForm({ ...partner });
  };

  const cancelEditing = () => {
    setEditingPartner(null);
    setEditForm(null);
  };

  const handleEditInputChange = (field: keyof Partner, value: string | number) => {
    if (!editForm) return;
    
    const numericFields = [
      'leadPotential', 
      'investmentPotential', 
      'engagement', 
      'strategicAlignment'
    ];

    const newValue = numericFields.includes(field)
      ? Number(value)
      : value;

    setEditForm(prev => ({
      ...prev!,
      [field]: newValue
    }));
  };

  const saveEdits = async () => {
    if (!editForm || !editingPartner) return;
    
    try {
      const updatedPartner = await updatePartner(editForm);
      
      // Update local state
      setPartners(partners.map(p => 
        p.id === updatedPartner.id ? updatedPartner : p
      ));
      
      toast.success('Parceiro atualizado!');
      cancelEditing();
    } catch (error) {
      console.error('Failed to update partner:', error);
      toast.error('Erro ao atualizar parceiro');
    }
  };

  const renderEditableCell = (partner: Partner, field: keyof Partner) => {
    if (editingPartner !== partner.id) {
      return displayValue(partner, field);
    }

    if (!editForm) return null;

    // Fields that need special rendering
    if (field === 'size') {
      return (
        <Select
          value={editForm.size}
          onValueChange={(value) => handleEditInputChange('size', value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Tamanho" />
          </SelectTrigger>
          <SelectContent>
            {companySize.map((size) => (
              <SelectItem key={size} value={size}>
                <div className="flex items-center gap-2">
                  <span
                    className="size-2 rounded-full"
                    style={{ backgroundColor: sizeColorMap[size] }}
                  ></span>
                  {size}
                </div>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Numeric fields
    if (
      field === 'leadPotential' ||
      field === 'investmentPotential' ||
      field === 'engagement' ||
      field === 'strategicAlignment'
    ) {
      return (
        <Select
          value={String(editForm[field])}
          onValueChange={(value) => handleEditInputChange(field, value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder={`Valor`} />
          </SelectTrigger>
          <SelectContent>
            {[0, 1, 2, 3, 4, 5].map((val) => (
              <SelectItem key={val} value={String(val)}>
                {val}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      );
    }

    // Default text input for other fields (name)
    return (
      <Input
        value={String(editForm[field])}
        onChange={(e) => handleEditInputChange(field, e.target.value)}
        className="w-full"
      />
    );
  };

  const displayValue = (partner: Partner, field: keyof Partner) => {
    if (field === 'size') {
      return (
        <div className="flex items-center gap-2">
          <span
            className="size-2 rounded-full"
            style={{ backgroundColor: sizeColorMap[partner.size] }}
          ></span>
          {partner.size}
        </div>
      );
    }
    return partner[field];
  };

  const SortIcon = ({ field }: { field: keyof Partner }) => {
    if (sortConfig.key !== field) {
      return null;
    }
    return sortConfig.direction === 'asc' ? (
      <ArrowDownAZ className="ml-1 h-4 w-4 inline" />
    ) : (
      <ArrowUpZA className="ml-1 h-4 w-4 inline" />
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col w-full">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <h1 className="text-xl md:text-2xl font-bold text-corporate-blue">
            Lista de Parceiros
          </h1>
          <div></div> {/* Empty div for spacing */}
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto py-6 px-4">
        <div className="flex justify-between items-center mb-6">
          <Button
            variant="outline"
            className="flex items-center gap-2"
            asChild
          >
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Gráfico
            </Link>
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Parceiros Cadastrados</CardTitle>
            <CardDescription>
              Visualize, filtre e edite os parceiros registrados.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {/* Filters */}
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <span className="text-sm font-medium">Filtros:</span>
              </div>
              <div className="flex-grow md:flex-grow-0 w-full md:w-auto">
                <Input
                  placeholder="Filtrar por nome..."
                  value={filters.name}
                  onChange={(e) => handleFilterChange('name', e.target.value)}
                  className="w-full"
                />
              </div>
              <div className="w-full md:w-auto">
                <Select
                  value={filters.size}
                  onValueChange={(value) => handleFilterChange('size', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Tamanho" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos os tamanhos</SelectItem>
                    {companySize.map((size) => (
                      <SelectItem key={size} value={size}>
                        {size}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Table */}
            {isLoading ? (
              <div className="flex justify-center items-center py-8">
                <p>Carregando parceiros...</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort('name')}
                      >
                        Nome
                        <SortIcon field="name" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort('leadPotential')}
                      >
                        Potencial de Leads
                        <SortIcon field="leadPotential" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort('investmentPotential')}
                      >
                        Potencial de Investimento
                        <SortIcon field="investmentPotential" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort('size')}
                      >
                        Tamanho
                        <SortIcon field="size" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort('engagement')}
                      >
                        Engajamento
                        <SortIcon field="engagement" />
                      </TableHead>
                      <TableHead
                        className="cursor-pointer"
                        onClick={() => handleSort('strategicAlignment')}
                      >
                        Alinhamento Estratégico
                        <SortIcon field="strategicAlignment" />
                      </TableHead>
                      <TableHead>Ações</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredPartners.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-6">
                          Nenhum parceiro encontrado
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredPartners.map((partner) => (
                        <TableRow key={partner.id}>
                          <TableCell>{renderEditableCell(partner, 'name')}</TableCell>
                          <TableCell>{renderEditableCell(partner, 'leadPotential')}</TableCell>
                          <TableCell>{renderEditableCell(partner, 'investmentPotential')}</TableCell>
                          <TableCell>{renderEditableCell(partner, 'size')}</TableCell>
                          <TableCell>{renderEditableCell(partner, 'engagement')}</TableCell>
                          <TableCell>{renderEditableCell(partner, 'strategicAlignment')}</TableCell>
                          <TableCell>
                            {editingPartner === partner.id ? (
                              <div className="flex gap-2">
                                <Button
                                  size="sm"
                                  variant="default"
                                  onClick={saveEdits}
                                >
                                  Salvar
                                </Button>
                                <Button
                                  size="sm"
                                  variant="outline"
                                  onClick={cancelEditing}
                                >
                                  Cancelar
                                </Button>
                              </div>
                            ) : (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => startEditing(partner)}
                              >
                                Editar
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </main>

      {/* Footer */}
      <footer className="bg-white shadow-inner p-4 mt-auto">
        <div className="container mx-auto text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} A&eight - Quadrante de Parceiros</p>
        </div>
      </footer>
    </div>
  );
};

export default PartnersList;
