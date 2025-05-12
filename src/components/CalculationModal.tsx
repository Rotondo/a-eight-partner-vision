
import React from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { HelpCircle } from 'lucide-react';

const CalculationModal = () => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-1">
          <HelpCircle className="h-4 w-4" />
          <span>Como é calculado?</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Memória de Cálculo</DialogTitle>
          <DialogDescription>
            Entenda como os valores são calculados para o quadrante
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 pt-4">
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Fórmulas:</h3>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">Eixo X (Leads):</p>
              <p className="text-sm text-muted-foreground mt-1">
                (Potencial de Leads × 0.4) + (Base de Clientes × 0.3) + (Engajamento × 0.2) + (Alinhamento × 0.1)
              </p>
            </div>
            
            <div className="bg-muted p-3 rounded-md">
              <p className="font-semibold">Eixo Y (Investimento):</p>
              <p className="text-sm text-muted-foreground mt-1">
                (Potencial de Investimento × 0.5) + (Tamanho × 0.3) + (Engajamento × 0.2)
              </p>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-medium text-lg">Legenda:</h3>
            <ul className="text-sm space-y-1 text-muted-foreground">
              <li>• <span className="font-medium">Potencial de Leads:</span> Capacidade de gerar leads (0-5)</li>
              <li>• <span className="font-medium">Potencial de Investimento:</span> Disponibilidade para investir (0-5)</li>
              <li>• <span className="font-medium">Base de Clientes:</span> Representado pelo tamanho da empresa</li>
              <li>• <span className="font-medium">Engajamento:</span> Nível de interação com a plataforma (0-5)</li>
              <li>• <span className="font-medium">Alinhamento:</span> Alinhamento estratégico com a empresa (0-5)</li>
            </ul>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CalculationModal;
