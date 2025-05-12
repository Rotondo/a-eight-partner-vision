
import React, { useState, useEffect } from 'react';
import Logo from '@/components/Logo';
import PartnerForm from '@/components/PartnerForm';
import QuadrantChart from '@/components/QuadrantChart';
import CalculationModal from '@/components/CalculationModal';
import { Partner, defaultPartner } from '@/types/partner';
import { toast } from '@/components/ui/sonner';
import { getPartners, savePartner, updatePartner, deletePartner } from '@/services/partnerService';

const Index = () => {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [currentPartner, setCurrentPartner] = useState<Partner>({...defaultPartner});
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    fetchPartners();
  }, []);
  
  const fetchPartners = async () => {
    try {
      setIsLoading(true);
      const fetchedPartners = await getPartners();
      setPartners(fetchedPartners);
    } catch (error) {
      console.error("Failed to fetch partners:", error);
      toast.error("Erro ao carregar parceiros");
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleSavePartner = async (partner: Partner) => {
    try {
      if (isEditing && partner.id) {
        // Update existing partner
        const updatedPartner = await updatePartner(partner);
        setPartners(prevPartners => 
          prevPartners.map(p => p.id === updatedPartner.id ? updatedPartner : p)
        );
      } else {
        // Add new partner
        const newPartner = await savePartner(partner);
        setPartners(prevPartners => [...prevPartners, newPartner]);
      }
      
      // Reset form
      setCurrentPartner({...defaultPartner});
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to save partner:", error);
      // Error toasts are already shown in service functions
    }
  };
  
  const handleDeletePartner = async (id: string) => {
    try {
      await deletePartner(id);
      setPartners(prevPartners => prevPartners.filter(p => p.id !== id));
      
      // If we're editing the partner that was just deleted, reset the form
      if (currentPartner.id === id) {
        setCurrentPartner({...defaultPartner});
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Failed to delete partner:", error);
      // Error toasts are already shown in service functions
    }
  };
  
  const handleSelectPartner = (partner: Partner) => {
    setCurrentPartner({...partner});
    setIsEditing(true);
    toast.info("Parceiro selecionado para edição");
  };
  
  const clearForm = () => {
    setCurrentPartner({...defaultPartner});
    setIsEditing(false);
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
              onDelete={handleDeletePartner}
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
              {isLoading ? (
                <div className="flex items-center justify-center h-full">
                  <p className="text-gray-500">Carregando parceiros...</p>
                </div>
              ) : (
                <QuadrantChart
                  partners={partners}
                  onSelectPartner={handleSelectPartner}
                />
              )}
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
