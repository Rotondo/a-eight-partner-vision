
import React, { useState } from 'react';
import Logo from '@/components/Logo';
import PartnerForm from '@/components/PartnerForm';
import QuadrantChart from '@/components/QuadrantChart';
import CalculationModal from '@/components/CalculationModal';
import { Partner, defaultPartner } from '@/types/partner';
import { toast } from '@/components/ui/sonner';

const Index = () => {
  const [partners, setPartners] = useState<Partner[]>([
    {
      id: "1",
      name: "VTEX",
      leadPotential: "5",
      investmentPotential: "4",
      size: "GG",
      engagement: "5",
      strategicAlignment: "5"
    },
    {
      id: "2",
      name: "Koin",
      leadPotential: "4",
      investmentPotential: "5",
      size: "G",
      engagement: "4",
      strategicAlignment: "4"
    },
    {
      id: "3",
      name: "Google",
      leadPotential: "5",
      investmentPotential: "1",
      size: "GG",
      engagement: "1",
      strategicAlignment: "1"
    },
    {
      id: "4",
      name: "Wake",
      leadPotential: "4",
      investmentPotential: "3",
      size: "G",
      engagement: "4",
      strategicAlignment: "5"
    },
    {
      id: "5",
      name: "Uappi",
      leadPotential: "5",
      investmentPotential: "3",
      size: "G",
      engagement: "4",
      strategicAlignment: "4"
    }
  ]);
  const [currentPartner, setCurrentPartner] = useState<Partner>({...defaultPartner});
  const [isEditing, setIsEditing] = useState(false);
  
  const handleSavePartner = (partner: Partner) => {
    if (isEditing && partner.id) {
      // Update existing partner
      setPartners(prevPartners => 
        prevPartners.map(p => p.id === partner.id ? partner : p)
      );
    } else {
      // Add new partner
      const newPartner = {
        ...partner,
        id: Date.now().toString()
      };
      setPartners(prevPartners => [...prevPartners, newPartner]);
    }
  };
  
  const handleSelectPartner = (partner: Partner) => {
    setCurrentPartner({...partner});
    setIsEditing(true);
    toast.info("Parceiro selecionado para edição");
  };
  
  const clearForm = () => {
    setCurrentPartner({...defaultPartner});
  };
  
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white shadow-sm p-4">
        <div className="container mx-auto flex justify-between items-center">
          <Logo />
          <h1 className="text-xl md:text-2xl font-bold text-corporate-blue">
            Quadrante de Parceiros
          </h1>
        </div>
      </header>
      
      {/* Main Content */}
      <main className="flex-grow container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
          {/* Left Panel - Form */}
          <div className="lg:col-span-3 bg-white rounded-lg shadow-md p-6 animate-fade-in h-full">
            <h2 className="text-xl font-semibold mb-6 text-corporate-blue">
              {isEditing ? "Editar Parceiro" : "Adicionar Novo Parceiro"}
            </h2>
            <PartnerForm
              partner={currentPartner}
              setPartner={setCurrentPartner}
              onSave={handleSavePartner}
              isEditing={isEditing}
              setIsEditing={setIsEditing}
              clearForm={clearForm}
            />
          </div>
          
          {/* Right Panel - Chart */}
          <div className="lg:col-span-7 bg-white rounded-lg shadow-md p-6 animate-fade-in h-[70vh]">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-corporate-blue">
                Quadrante de Parceiros
              </h2>
              <CalculationModal />
            </div>
            <div className="h-full">
              <QuadrantChart
                partners={partners}
                onSelectPartner={handleSelectPartner}
              />
            </div>
          </div>
        </div>
      </main>
      
      {/* Footer */}
      <footer className="bg-white shadow-inner p-4 mt-8">
        <div className="container mx-auto text-center text-sm text-gray-600">
          <p>&copy; {new Date().getFullYear()} A&eight - Quadrante de Parceiros</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
