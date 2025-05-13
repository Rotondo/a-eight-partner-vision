
import React, { useState, useEffect } from 'react';
import Logo from '@/components/Logo';
import PartnerForm from '@/components/PartnerForm';
import QuadrantChart from '@/components/QuadrantChart';
import CalculationModal from '@/components/CalculationModal';
import { Partner, defaultPartner } from '@/types/partner';
import { toast } from '@/components/ui/sonner';
import { getPartners, savePartner, updatePartner, deletePartner } from '@/services/partnerService';
import { Sidebar, SidebarProvider, SidebarContent, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar"

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
      let updatedPartners;
      
      if (isEditing && partner.id) {
        const updatedPartner = await updatePartner(partner);
        updatedPartners = partners.map(p => p.id === updatedPartner.id ? updatedPartner : p);
      } else {
        const newPartner = await savePartner(partner);
        updatedPartners = [...partners, newPartner];
      }
      
      setPartners(updatedPartners);
      clearForm();
      toast.success(isEditing ? "Parceiro atualizado!" : "Parceiro adicionado!");
      
    } catch (error) {
      console.error("Failed to save partner:", error);
      toast.error("Erro ao salvar parceiro");
    }
  };
  
  const handleDeletePartner = async (id: string) => {
    try {
      await deletePartner(id);
      const updatedPartners = partners.filter(p => p.id !== id);
      setPartners(updatedPartners);
      
      if (currentPartner.id === id) {
        clearForm();
      }
      
      toast.success("Parceiro excluído!");
    } catch (error) {
      console.error("Failed to delete partner:", error);
      toast.error("Erro ao excluir parceiro");
    }
  };
  
  const handleSelectPartner = (partner: Partner) => {
    setCurrentPartner(partner);
    setIsEditing(true);
    toast.info("Parceiro selecionado para edição");
  };
  
  const clearForm = () => {
    setCurrentPartner({...defaultPartner});
    setIsEditing(false);
  };
  
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex flex-col w-full">
        {/* Header */}
        <header className="bg-white shadow-sm p-4">
          <div className="container mx-auto flex justify-between items-center">
            <Logo />
            <h1 className="text-xl md:text-2xl font-bold text-corporate-blue">
              Quadrante de Parceiros
            </h1>
            <SidebarTrigger className="lg:hidden" />
          </div>
        </header>
        
        {/* Main Content */}
        <main className="flex-grow flex">
          <div className="flex flex-1 gap-6 h-[calc(100vh-120px)] w-full p-4">
            {/* Sidebar */}
            <Sidebar collapsible="offcanvas" className="lg:w-80">
              <SidebarContent className="bg-white rounded-lg shadow-md p-6 h-full relative">
                <div className="absolute top-4 right-4">
                  <SidebarTrigger />
                </div>
                <h2 className="text-xl font-semibold mb-6 text-corporate-blue">
                  {isEditing ? "Editar Parceiro" : "Novo Parceiro"}
                </h2>
                <PartnerForm
                  partner={currentPartner}
                  setPartner={setCurrentPartner}
                  onSave={handleSavePartner}
                  onDelete={handleDeletePartner}
                  isEditing={isEditing}
                  clearForm={clearForm}
                />
              </SidebarContent>
            </Sidebar>
            
            {/* Gráfico */}
            <SidebarInset className="flex-1 h-full">
              <div className="bg-white rounded-lg shadow-md h-full flex flex-col">
                <div className="p-4 border-b">
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold text-corporate-blue">
                      Visualização Estratégica
                    </h2>
                    <CalculationModal />
                  </div>
                </div>
                <div className="flex-1 p-2 overflow-hidden">
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
            </SidebarInset>
          </div>
        </main>
        
        {/* Footer */}
        <footer className="bg-white shadow-inner p-4 mt-auto">
          <div className="container mx-auto text-center text-sm text-gray-600">
            <p>&copy; {new Date().getFullYear()} A&eight - Quadrante de Parceiros</p>
          </div>
        </footer>
      </div>
    </SidebarProvider>
  );
};

export default Index;
