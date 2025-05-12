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
    
    // Validação numérica adicional
    const numericFieldsValid = [
      partner.leadPotential,
      partner.investmentPotential,
      partner.engagement,
      partner.strategicAlignment || 0
    ].every(value => !isNaN(value) && value >= 0 && value <= 5);

    if (!numericFieldsValid) {
      toast.error("Valores numéricos devem estar entre 0 e 5");
      return;
    }

    if (validatePartnerForm(partner)) {
      onSave(partner);
    }
  };

  // Conversão robusta para números
  const handleInputChange = (field: keyof Partner, value: string | number) => {
    const numericFields = [
      'leadPotential', 
      'investmentPotential', 
      'engagement', 
      'strategicAlignment'
    ];

    const newValue = numericFields.includes(field)
      ? Number(value.toString().replace(/[^0-9.]/g, '')) || 0
      : value;

    setPartner(prev => ({
      ...prev,
      [field]: newValue
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
          required
        />
      </div>

      {/* Campos numéricos com validação visual */}
      {['leadPotential', 'investmentPotential', 'engagement'].map((field) => (
        <div className="space-y-2" key={field}>
          <Label htmlFor={field}>{{
            leadPotential: 'Potencial de Geração de Leads',
            investmentPotential: 'Potencial de Investimento',
            engagement: 'Engajamento'
          }[field]}</Label>
          <Select
            value={partner[field as keyof Partner]?.toString()}
            onValueChange={(value) => handleInputChange(field as keyof Partner, value)}
          >
            <SelectTrigger>
              <SelectValue placeholder={`Selecione ${field}`} />
            </SelectTrigger>
            <SelectContent>
              {potentialOptions.map((option) => (
                <SelectItem 
                  key={option} 
                  value={option.toString()}
                  className="flex justify-between"
                >
                  <span>{option}</span>
                  <span className="text-muted-foreground ml-2">
                    ({['leadPotential', 'investmentPotential'].includes(field) ? 'Prioridade' : 'Nível'} {option})
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ))}

      <div className="space-y-2">
        <Label htmlFor="size">Tamanho da Empresa</Label>
        <Select
          value={partner.size}
          onValueChange={(value) => handleInputChange('size', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o tamanho" />
          </SelectTrigger>
          <SelectContent>
            {companySize.map((size) => (
              <SelectItem 
                key={size} 
                value={size}
                className="flex items-center gap-2"
              >
                <span className="size-2 rounded-full bg-current" />
                {size}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="strategicAlignment">Alinhamento Estratégico</Label>
        <Select
          value={(partner.strategicAlignment || 0).toString()}
          onValueChange={(value) => handleInputChange('strategicAlignment', value)}
        >
          <SelectTrigger>
            <SelectValue placeholder="Selecione o alinhamento" />
          </SelectTrigger>
          <SelectContent>
            {strategicAlignmentOptions.map((option) => (
              <SelectItem 
                key={option} 
                value={option.toString()}
                className={option >= 3 ? 'bg-green-50' : 'bg-red-50'}
              >
                {option} {option >= 3 ? '🌟' : '⚠️'}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pt-2 space-y-2">
        <Button
          type="submit"
          className="w-full bg-corporate-blue hover:bg-opacity-90"
          disabled={!validatePartnerForm(partner)}
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
