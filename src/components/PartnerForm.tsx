import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Partner, companySize, potentialOptions, engagementOptions, strategicAlignmentOptions } from '@/types/partner';
import { validatePartnerForm } from '@/lib/form-utils';
import { toast } from '@/components/ui/sonner';
import { Trash2 } from 'lucide-react';

interface PartnerFormProps {
  partner: Partner;
  setPartner: React.Dispatch<React.SetStateAction<Partner>>;
  onSave: (partner: Partner) => void;
  onDelete: (id: string) => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  clearForm: () => void;
}

const PartnerForm: React.FC<PartnerFormProps> = ({
  partner,
  setPartner,
  onSave,
  onDelete,
  isEditing,
  setIsEditing,
  clearForm
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validatePartnerForm(partner)) {
      onSave(partner);
    }
  };

  // Agora todos os campos numéricos são tratados como number
  const handleInputChange = (field: keyof Partner, value: string | number) => {
    setPartner(prev => ({
      ...prev,
      [field]: (field === 'leadPotential' || field === 'investmentPotential' || field === 'engagement' || field === 'strategicAlignment')
        ? Number(value)
        : value
    }));
  };

  const handleDelete = () => {
    if (partner.id && confirm("Tem certeza que deseja excluir este parceiro?")) {
      onDelete(partner.id);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome do Parceiro*</Label>
        <Input
          id="name"
          value={partner.name}
          onChange={(e) => handleInputChange('name', e.target.value)}
          placeholder="Nome do parceiro"
          className="w-full"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="leadPotential">Potencial de Geração de Leads</Label>
        <Select
          value={partner.leadPotential.toString()}
          onValueChange={(value) => handleInputChange('leadPotential', value)}
        >
          <SelectTrigger id="leadPotential" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {potentialOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="investmentPotential">Potencial de Investimento</Label>
        <Select
          value={partner.investmentPotential.toString()}
          onValueChange={(value) => handleInputChange('investmentPotential', value)}
        >
          <SelectTrigger id="investmentPotential" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {potentialOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="size">Tamanho da Empresa</Label>
        <Select
          value={partner.size}
          onValueChange={(value) => handleInputChange('size', value)}
        >
          <SelectTrigger id="size" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {companySize.map((size) => (
              <SelectItem key={size} value={size}>
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="engagement">Engajamento</Label>
        <Select
          value={partner.engagement.toString()}
          onValueChange={(value) => handleInputChange('engagement', value)}
        >
          <SelectTrigger id="engagement" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {engagementOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="strategicAlignment">Alinhamento Estratégico</Label>
        <Select
          value={partner.strategicAlignment?.toString() || "0"}
          onValueChange={(value) => handleInputChange('strategicAlignment', value)}
        >
          <SelectTrigger id="strategicAlignment" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {strategicAlignmentOptions.map((option) => (
              <SelectItem key={option} value={option.toString()}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pt-2 space-y-2">
        <Button
          type="submit"
          className="w-full bg-corporate-blue hover:bg-opacity-90"
        >
          {isEditing ? "Salvar Edições" : "Adicionar Parceiro"}
        </Button>
        
        {isEditing && (
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={clearForm}
              className="w-full"
            >
              Cancelar
            </Button>
            
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              className="flex-shrink-0"
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </form>
  );
};

export default PartnerForm;
