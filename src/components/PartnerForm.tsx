
import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Partner, companySize, potentialOptions, engagementOptions, strategicAlignmentOptions, defaultPartner } from '@/types/partner';
import { validatePartnerForm } from '@/lib/form-utils';
import { toast } from '@/components/ui/sonner';

interface PartnerFormProps {
  partner: Partner;
  setPartner: React.Dispatch<React.SetStateAction<Partner>>;
  onSave: (partner: Partner) => void;
  isEditing: boolean;
  setIsEditing: React.Dispatch<React.SetStateAction<boolean>>;
  clearForm: () => void;
}

const PartnerForm: React.FC<PartnerFormProps> = ({
  partner,
  setPartner,
  onSave,
  isEditing,
  setIsEditing,
  clearForm
}) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validatePartnerForm(partner)) {
      onSave(partner);
      clearForm();
      if (isEditing) {
        toast.success("Parceiro atualizado com sucesso");
        setIsEditing(false);
      } else {
        toast.success("Parceiro adicionado com sucesso");
      }
    }
  };

  const handleInputChange = (field: keyof Partner, value: string) => {
    setPartner(prev => ({ ...prev, [field]: value }));
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
          value={partner.leadPotential}
          onValueChange={(value) => handleInputChange('leadPotential', value)}
        >
          <SelectTrigger id="leadPotential" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {potentialOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="investmentPotential">Potencial de Investimento</Label>
        <Select
          value={partner.investmentPotential}
          onValueChange={(value) => handleInputChange('investmentPotential', value)}
        >
          <SelectTrigger id="investmentPotential" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {potentialOptions.map((option) => (
              <SelectItem key={option} value={option}>
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
          value={partner.engagement}
          onValueChange={(value) => handleInputChange('engagement', value)}
        >
          <SelectTrigger id="engagement" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {engagementOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="strategicAlignment">Alinhamento Estratégico</Label>
        <Select
          value={partner.strategicAlignment || "0"}
          onValueChange={(value) => handleInputChange('strategicAlignment', value)}
        >
          <SelectTrigger id="strategicAlignment" className="w-full">
            <SelectValue placeholder="Selecione" />
          </SelectTrigger>
          <SelectContent>
            {strategicAlignmentOptions.map((option) => (
              <SelectItem key={option} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="pt-2">
        <Button
          type="submit"
          className="w-full bg-corporate-blue hover:bg-opacity-90"
        >
          {isEditing ? "Salvar Edições" : "Adicionar Parceiro"}
        </Button>
        
        {isEditing && (
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              clearForm();
              setIsEditing(false);
            }}
            className="w-full mt-2"
          >
            Cancelar
          </Button>
        )}
      </div>
    </form>
  );
};

export default PartnerForm;
