import React, { useState, useEffect, useRef } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie, Legend 
} from 'recharts';
import { 
  FileText, Send, CheckCircle, Clock, Search, ChevronRight, Bot, Users, FilePlus, LogOut, FileCheck, Plus, Trash2, Package, UserPlus, Power, Tag, Save, AlertCircle, DollarSign, Layers, AlertTriangle, TrendingUp, BarChart3, Database, RefreshCw, Calendar, Upload, FileSpreadsheet, Download, File, Calculator, X, Info, Lock, ArrowUp, ArrowDown, Minus, LayoutDashboard, Settings, FileDown
} from 'lucide-react';

// Importações baseadas na sua estrutura de pastas (Imagem 3)
import { Role, ProcessData, ProcessStatus, RequestItem, User, StatusOption, ProductGroup, ProductDatabaseItem, DocumentTemplate } from './types';
import { generateDocumentFields, analyzeRequestFeasibility } from './services/geminiService';
import { TEMPLATE_MOTIVACAO, TEMPLATE_MEMORANDO } from './utils/templatesReais';

// --- ENUMS & TYPES ADICIONAIS ---
enum ProcessPriority {
  LOW = 'Baixa',
  NORMAL = 'Normal',
  HIGH = 'Alta'
}

// --- CONFIGURAÇÃO DO LAYOUT ---
interface LayoutProps {
  children: React.ReactNode;
  currentRole: Role;
  setRole: (role: Role) => void;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
}

const Layout: React.FC<LayoutProps> = ({ children, currentRole, setRole, activeTab, setActiveTab, currentUser }) => {
  // Verifica se o usuário REAL tem privilégios (Admin ou Manager)
  const isPrivilegedUser = currentUser?.role === Role.ADMIN || currentUser?.role === Role.MANAGER;

  const renderSidebarItems = () => {
    // 1. SOLICITANTE
    if (currentRole === Role.REQUESTER) {
      return (
        <>
          <button onClick={() => setActiveTab('new-request')} className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${activeTab === 'new-request' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <FilePlus size={20} /> <span className="font-medium">Nova Solicitação</span>
          </button>
          <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
            <LayoutDashboard size={20} /> <span className="font-medium">Meus Pedidos</span>
          </button>
        </>
      );
    }

    // 2. ANALISTA
    if (currentRole === Role.ANALYST) {
      return (
        <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <CheckCircle size={20} /> <span className="font-medium">Minhas Tarefas</span>
        </button>
      );
    }

    // 3. ADMIN ou GERENTE (Menu Completo)
    return (
      <>
        <button onClick={() => setActiveTab('dashboard')} className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${activeTab === 'dashboard' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <LayoutDashboard size={20} /> <span className="font-medium">Painel de Controle</span>
        </button>

        {/* Botão Nova Solicitação disponível também para Gerente/Admin */}
        <button onClick={() => setActiveTab('new-request')} className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${activeTab === 'new-request' ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
           <FilePlus size={20} /> <span className="font-medium">Nova Solicitação</span>
        </button>
        
        {currentUser?.role === Role.ADMIN && (
          <>
            <div className="pt-4 pb-2 text-xs font-bold text-slate-600 uppercase tracking-wider">Administração</div>
            <button onClick={() => setActiveTab('admin-users')} className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${activeTab === 'admin-users' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Users size={20} /> <span className="font-medium">Usuários</span>
            </button>
            <button onClick={() => setActiveTab('admin-config')} className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${activeTab === 'admin-config' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
              <Settings size={20} /> <span className="font-medium">Configurações</span>
            </button>
          </>
        )}

        <button onClick={() => setActiveTab('reports')} className={`w-full text-left px-4 py-3 rounded-lg mb-2 flex items-center gap-3 transition-colors ${activeTab === 'reports' ? 'bg-slate-700 text-white' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
          <BarChart3 size={20} /> <span className="font-medium">Relatórios</span>
        </button>
      </>
    );
  };

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">
      <aside className="w-64 bg-slate-900 text-white flex flex-col shadow-2xl z-20">
        <div className="p-6 border-b border-slate-800">
          <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-teal-400 bg-clip-text text-transparent">PlanFlow</h1>
          <p className="text-xs text-slate-500 mt-1">Gestão Inteligente</p>
        </div>

        <nav className="flex-1 p-4 overflow-y-auto">
          {renderSidebarItems()}
        </nav>

        {isPrivilegedUser && (
          <div className="p-4 border-t border-slate-800 bg-slate-800/50">
            <p className="text-[10px] font-bold text-slate-500 uppercase mb-3 tracking-wider">Simular Acesso Como:</p>
            <div className="space-y-2">
              <button onClick={() => { setRole(Role.REQUESTER); setActiveTab('dashboard'); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-all ${currentRole === Role.REQUESTER ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}><span>Solicitante</span>{currentRole === Role.REQUESTER && <div className="w-2 h-2 bg-white rounded-full"></div>}</button>
              <button onClick={() => { setRole(Role.MANAGER); setActiveTab('dashboard'); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-all ${currentRole === Role.MANAGER ? 'bg-blue-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}><span>Gerente</span>{currentRole === Role.MANAGER && <div className="w-2 h-2 bg-white rounded-full"></div>}</button>
              <button onClick={() => { setRole(Role.ANALYST); setActiveTab('dashboard'); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-all ${currentRole === Role.ANALYST ? 'bg-teal-500 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}><span>Analista</span>{currentRole === Role.ANALYST && <div className="w-2 h-2 bg-white rounded-full"></div>}</button>
              {currentUser?.role === Role.ADMIN && (
                <button onClick={() => { setRole(Role.ADMIN); setActiveTab('dashboard'); }} className={`w-full flex items-center justify-between px-3 py-2 rounded text-sm transition-all ${currentRole === Role.ADMIN ? 'bg-slate-600 text-white shadow-md' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}><span>Admin</span>{currentRole === Role.ADMIN && <div className="w-2 h-2 bg-white rounded-full"></div>}</button>
              )}
            </div>
          </div>
        )}
      </aside>
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-8 pb-24">
          {children}
        </div>
      </main>
    </div>
  );
};

// --- DADOS E CONSTANTES ---
const SLA_DAYS_LIMIT = 3; 
const INITIAL_STATUS_OPTIONS: StatusOption[] = [
  { id: 'st-1', label: 'Aguardando Assinatura', color: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
  { id: 'st-2', label: 'Em Cotação', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'st-3', label: 'Problema no Pedido', color: 'bg-red-100 text-red-800 border-red-200' },
  { id: 'st-4', label: 'Pronto para Retirada', color: 'bg-teal-100 text-teal-800 border-teal-200' },
];
const INITIAL_PRODUCT_GROUPS: ProductGroup[] = [
  { id: 'pg-1', name: 'Material de Expediente' },
  { id: 'pg-2', name: 'Informática e TI' },
  { id: 'pg-3', name: 'Limpeza e Higiene' },
  { id: 'pg-4', name: 'Mobiliário' },
  { id: 'pg-5', name: 'Manutenção Predial' },
];
const INITIAL_TEMPLATES: DocumentTemplate[] = [
  { id: 'tmpl-memo', name: 'Memorando de Solicitação', type: 'docx', fileName: 'Memorando_Padrao.doc', lastUpdated: '09/12/2025' },
  { id: 'tmpl-motivacao', name: 'Motivação do Ato', type: 'docx', fileName: 'Motivacao_Ato.doc', lastUpdated: '09/12/2025' },
];
const INITIAL_USERS: (User & { username?: string; password?: string })[] = [
  { id: 'u1', name: 'João Silva', role: Role.REQUESTER, active: true, username: 'joao', password: '123' },
  { id: 'u2', name: 'Maria Souza', role: Role.REQUESTER, active: true, username: 'maria', password: '123' },
  { id: 'u3', name: 'Gerente Ana', role: Role.MANAGER, active: true, username: 'ana', password: '123' },
  { id: 'u4', name: 'Analista Pedro', role: Role.ANALYST, active: true, username: 'pedro', password: '123' },
  { id: 'u5', name: 'Admin Master', role: Role.ADMIN, active: true, username: 'admin', password: '123' },
];
const INITIAL_SHEET_DATA: ProductDatabaseItem[] = [
  { familia: '10', idGMS: '102030', descricao: 'Papel A4 Alcalino 75g (Resma)', consolidadoDT: 'DT-2024-EXP-01', estoque: 1500 },
  { familia: '10', idGMS: '102031', descricao: 'Caneta Esferográfica Azul (Cx 50un)', consolidadoDT: 'DT-2024-EXP-02', estoque: 200 },
  { familia: '40', idGMS: '405060', descricao: 'Toner HP LaserJet 85A Original', consolidadoDT: 'DT-2024-TI-05', estoque: 15 },
  { familia: '50', idGMS: '501020', descricao: 'Detergente Líquido Neutro 5L', consolidadoDT: 'DT-2024-LIM-01', estoque: 45 },
];
const INITIAL_DATA: (ProcessData & { priority?: ProcessPriority })[] = [
  {
    id: 'REQ-001',
    requesterName: 'João Silva',
    ataPregao: '12/2023',
    items: [
      { lote: '05', gmsCode: '405060', quantidade: 50, consolidadoDT: 'DT-2024-X', estoqueAtual: 5, descricao: 'Aquisição urgente de toners para impressoras do 2º andar.', valorUnitario: 125.90 }
    ],
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    status: ProcessStatus.PENDING,
    priority: ProcessPriority.HIGH
  },
  {
    id: 'REQ-002',
    requesterName: 'Maria Souza',
    ataPregao: '08/2024',
    items: [
      { lote: '01', gmsCode: '102030', quantidade: 200, consolidadoDT: 'DT-2024-Y', estoqueAtual: 120, descricao: 'Resmas de papel A4 para estoque trimestral.' },
      { lote: '03', gmsCode: '102031', quantidade: 50, consolidadoDT: 'DT-2024-Y', estoqueAtual: 10, descricao: 'Canetas azuis esferográficas.' }
    ],
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    status: ProcessStatus.DISTRIBUTED,
    assignedTo: 'Analista Pedro',
    distributedAt: new Date().toISOString(),
    customStatusId: 'st-2',
    productGroupId: 'pg-1',
    totalValue: 1500.50,
    priority: ProcessPriority.NORMAL
  }
];

const App: React.FC = () => {
  // 1. STATES
  const [role, setRole] = useState<Role>(Role.REQUESTER); 
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  
  // Filtros de Pesquisa e Relatório
  const [dashboardSearchTerm, setDashboardSearchTerm] = useState('');
  const [filterStartDate, setFilterStartDate] = useState('');
  const [filterEndDate, setFilterEndDate] = useState('');

  // Login States
  const [loginUser, setLoginUser] = useState('');
  const [loginPass, setLoginPass] = useState('');
  const [loginError, setLoginError] = useState('');
   
  const [processes, setProcesses] = useState<(ProcessData & { priority?: ProcessPriority })[]>(() => {
    if (typeof window !== 'undefined') {
        const saved = localStorage.getItem('funeas_processes');
        return saved ? JSON.parse(saved) : INITIAL_DATA;
    }
    return INITIAL_DATA;
  });

  useEffect(() => {
    localStorage.setItem('funeas_processes', JSON.stringify(processes));
  }, [processes]);

  // Segurança: Garante que Analista/Solicitante nunca saiam do seu papel
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === Role.ANALYST && role !== Role.ANALYST) setRole(Role.ANALYST);
      if (currentUser.role === Role.REQUESTER && role !== Role.REQUESTER) setRole(Role.REQUESTER);
    }
  }, [role, currentUser]);

  const [users, setUsers] = useState<User[]>(INITIAL_USERS);
  const [statusOptions, setStatusOptions] = useState<StatusOption[]>(INITIAL_STATUS_OPTIONS);
  const [productGroups, setProductGroups] = useState<ProductGroup[]>(INITIAL_PRODUCT_GROUPS);
  const [sheetData, setSheetData] = useState<ProductDatabaseItem[]>(INITIAL_SHEET_DATA);
  const [templates, setTemplates] = useState<DocumentTemplate[]>(INITIAL_TEMPLATES);
  const [lastSyncDate, setLastSyncDate] = useState<string>(new Date().toLocaleDateString());
  const [selectedProcess, setSelectedProcess] = useState<(ProcessData & { priority?: ProcessPriority }) | null>(null);
   
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiFieldsLoading, setIsAiFieldsLoading] = useState(false);
  const [generatedDoc, setGeneratedDoc] = useState('');
  const [aiAnalysis, setAiAnalysis] = useState('');
   
  const [newRequestAta, setNewRequestAta] = useState('');
  const [newRequestItems, setNewRequestItems] = useState<RequestItem[]>([
    { lote: '', gmsCode: '', quantidade: 0, consolidadoDT: '', estoqueAtual: 0, descricao: '' }
  ]);

  const [analystInput, setAnalystInput] = useState({ memo: '' }); 
  const [protocolEditMode, setProtocolEditMode] = useState(''); 
  const [isEditingProtocol, setIsEditingProtocol] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', role: Role.REQUESTER });
  const [newProductGroup, setNewProductGroup] = useState('');
  
  const [distributeTo, setDistributeTo] = useState('');
  const [distributePriority, setDistributePriority] = useState<ProcessPriority>(ProcessPriority.NORMAL);

  const modalRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (selectedProcess && modalRef.current) {
      modalRef.current.scrollTop = 0;
      setDistributePriority(selectedProcess.priority || ProcessPriority.NORMAL);
    }
  }, [selectedProcess?.id]);

  // 2. HELPER FUNCTIONS
  const handleSecureSetRole = (newRole: Role) => {
    if (!currentUser) return;
    if (currentUser.role === Role.ADMIN || currentUser.role === Role.MANAGER) {
      setRole(newRole);
    } 
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const userFound = users.find(u => {
      const uTest = u as any; 
      return uTest.username === loginUser && uTest.password === loginPass;
    });

    if (userFound) {
      setCurrentUser(userFound);
      setRole(userFound.role); 
      setIsAuthenticated(true);
      setLoginError('');
      if (userFound.role === Role.ADMIN) setActiveTab('dashboard');
      else setActiveTab('dashboard');
    } else {
      setLoginError('Usuário ou senha incorretos.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setLoginUser('');
    setLoginPass('');
    setLoginError('');
    setActiveTab('dashboard');
  };

  const handleAddItem = () => {
    setNewRequestItems([...newRequestItems, { lote: '', gmsCode: '', quantidade: 0, consolidadoDT: '', estoqueAtual: 0, descricao: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (newRequestItems.length > 1) {
      setNewRequestItems(newRequestItems.filter((_, i) => i !== index));
    }
  };

  const handleUpdateItem = (index: number, field: keyof RequestItem, value: string | number) => {
    const updated = [...newRequestItems];
    updated[index] = { ...updated[index], [field]: value };
    setNewRequestItems(updated);
  };

  const handleGmsSearch = (index: number, code: string) => {
    const found = sheetData.find(item => item.idGMS === code || `${item.familia}${item.idGMS}` === code);
    if (found) {
      const updated = [...newRequestItems];
      updated[index] = { 
        ...updated[index],
        gmsCode: code,
        descricao: found.descricao,
        consolidadoDT: found.consolidadoDT,
        estoqueAtual: found.estoque
      };
      setNewRequestItems(updated);
    } else {
      alert(`Código GMS ${code} não encontrado na base de dados sincronizada.`);
    }
  };

  // --- CORREÇÃO DE IMPORTAÇÃO (Encoding) ---
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      if (!text) return;
      try {
        const lines = text.split('\n');
        const newItems: ProductDatabaseItem[] = [];
        const startIndex = lines[0].toLowerCase().includes('familia') ? 1 : 0;
        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          const cols = line.includes(';') ? line.split(';') : line.split(',');
          if (cols.length >= 5) {
             newItems.push({
               familia: cols[0]?.trim(),
               idGMS: cols[1]?.trim(),
               descricao: cols[2]?.trim(),
               consolidadoDT: cols[3]?.trim(),
               estoque: Number(cols[4]?.trim().replace(',', '.') || 0)
             });
          }
        }
        if (newItems.length > 0) {
          setSheetData(newItems);
          setLastSyncDate(new Date().toLocaleDateString());
          alert(`${newItems.length} produtos importados com sucesso!`);
        } else {
          alert("Nenhum dado válido encontrado no arquivo.");
        }
      } catch (err) {
        alert("Erro ao ler o arquivo.");
      }
    };
    // Leitura forçada em Latin-1 para corrigir acentos do Excel/Windows
    reader.readAsText(file, 'ISO-8859-1'); 
    if(fileInputRef.current) fileInputRef.current.value = '';
  };

  // --- EXPORTAÇÃO NATIVA (Sem biblioteca externa para evitar erro de build) ---
  const handleExportReport = (filteredData: typeof processes) => {
    try {
        const isManagerOrAdmin = currentUser?.role === Role.ADMIN || currentUser?.role === Role.MANAGER;
        
        // BOM para UTF-8 (Corrige abertura direta no Excel)
        const bom = "\uFEFF"; 
        
        const header = [
            "ID_PEDIDO", "PROTOCOLO", "DATA_CRIACAO", "STATUS", 
            "LOTE", "COD_GMS", "DESCRICAO_ITEM", "QUANTIDADE", "VALOR_UNIT", "VALOR_TOTAL",
            ...(isManagerOrAdmin ? ["SOLICITANTE", "ANALISTA_RESPONSAVEL", "PRIORIDADE", "GRUPO_PRODUTO", "DIAS_ABERTO"] : [])
        ];
        
        let csvContent = header.join(";") + "\n";

        filteredData.forEach(p => {
            const daysOpen = Math.ceil(Math.abs(new Date().getTime() - new Date(p.createdAt).getTime()) / (1000 * 60 * 60 * 24));
            const groupName = productGroups.find(g => g.id === p.productGroupId)?.name || '-';

            p.items.forEach(item => {
                const row = [
                    p.id || '',
                    p.protocolNumber || '-',
                    p.createdAt ? new Date(p.createdAt).toLocaleDateString() : '',
                    p.status || '',
                    item.lote || '',
                    item.gmsCode || '-',
                    `"${(item.descricao || '').replace(/"/g, '""')}"`, // Escape quotes
                    item.quantidade || 0,
                    (item.valorUnitario || 0).toFixed(2).replace('.', ','),
                    ((item.valorUnitario || 0) * (item.quantidade || 0)).toFixed(2).replace('.', ','),
                    ...(isManagerOrAdmin ? [
                        p.requesterName || '',
                        p.assignedTo || '-',
                        p.priority || '-',
                        groupName,
                        daysOpen
                    ] : [])
                ];
                csvContent += row.join(";") + "\n";
            });
        });

        const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `relatorio_funeas_${new Date().toLocaleDateString().replace(/\//g, '-')}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    } catch (error) {
        alert("Erro ao exportar relatório. Verifique os dados.");
        console.error(error);
    }
  };

  const downloadTemplate = () => {
    const bom = "\uFEFF";
    const header = "FAMILIA;ID_GMS;DESCRICAO;CONSOLIDADO_DT;ESTOQUE\n";
    const example1 = "10;102030;Papel A4 Alcalino;DT-2024-01;500\n";
    const blob = new Blob([bom + header + example1], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'template_importacao_gms.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleGenerateAiFields = async () => {
    if (!selectedProcess) return;
    setIsAiFieldsLoading(true);
    const fields = await generateDocumentFields(selectedProcess) as any;
    if (fields) {
      handleUpdateProcessField(selectedProcess.id, 'aiSubject', fields.subject || '');
      handleUpdateProcessField(selectedProcess.id, 'aiMotivation', fields.motivation || '');
    }
    setIsAiFieldsLoading(false);
  };

  const generateFileFromTemplate = (template: DocumentTemplate, process: ProcessData, memo: string, protocol: string) => {
    const totalValue = process.items.reduce((acc, item) => acc + (item.quantidade * (item.valorUnitario || 0)), 0);
    const formattedTotal = formatCurrency(totalValue);
    const dataHoje = new Date().toLocaleDateString('pt-BR');
    let fileContent = '';
    
    if (template.id === 'tmpl-memo') {
      fileContent = TEMPLATE_MEMORANDO;
    } else if (template.id === 'tmpl-motivacao') {
      fileContent = TEMPLATE_MOTIVACAO;
    } else {
      alert("Template ainda não configurado.");
      return;
    }

    fileContent = fileContent.replace('<head>', '<head><meta http-equiv="Content-Type" content="text/html; charset=utf-8">');

    let tabelasDinamicasHtml = '';
    if (template.id === 'tmpl-memo') {
      const itemsBySupplier: Record<string, typeof process.items> = {};
      process.items.forEach(item => {
        const i = item as any;
        const supplierKey = (i.supplierName && i.supplierName.trim() !== '') 
          ? `${i.supplierName} - CNPJ: ${i.supplierCNPJ || 'Não informado'}` 
          : 'FORNECEDOR A DEFINIR';
        if (!itemsBySupplier[supplierKey]) itemsBySupplier[supplierKey] = [];
        itemsBySupplier[supplierKey].push(item);
      });

      Object.entries(itemsBySupplier).forEach(([supplierHeader, items]) => {
        const subTotal = items.reduce((acc, item) => acc + (item.quantidade * (item.valorUnitario || 0)), 0);
        let rowsHtml = items.map(item => `
          <tr>
            <td>${item.lote}</td>
            <td>${item.gmsCode || '-'}</td>
            <td style="text-align: left;">${item.descricao}</td>
            <td>UN</td>
            <td>${item.quantidade}</td>
            <td>${formatCurrency(item.valorUnitario)}</td>
            <td>${formatCurrency((item.valorUnitario || 0) * item.quantidade)}</td>
          </tr>
        `).join('');

        tabelasDinamicasHtml += `
          <table>
            <thead>
              <tr><th colspan="7" style="background-color: #dbe5f1; text-align: center; vertical-align: middle;">${supplierHeader.toUpperCase()}</th></tr>
              <tr><th>LOTE</th><th>CÓD. GMS</th><th>DESCRIÇÃO</th><th>UNID</th><th>QTDE</th><th>VLR UNIT</th><th>VLR TOTAL</th></tr>
            </thead>
            <tbody>${rowsHtml}</tbody>
            <tfoot>
              <tr>
                <td colspan="6" style="text-align: right; font-weight: bold; background-color: #f0f0f0;">TOTAL FORNECEDOR:</td>
                <td style="font-weight: bold; color: #000; background-color: #f0f0f0;">${formatCurrency(subTotal)}</td>
              </tr>
            </tfoot>
          </table>
          <br/>
        `;
      });
      tabelasDinamicasHtml += `<div style="text-align: right; margin-top: 10px; margin-bottom: 20px; font-weight: bold; font-size: 10pt; border: 1px solid #000; padding: 5px; background-color: #ddd;">TOTAL GERAL DO PROCESSO: ${formattedTotal}</div>`;
    }

    const replacements: Record<string, string> = {
      '{{ TABELAS_COMPRA_DINAMICAS }}': tabelasDinamicasHtml,
      '{{ numero_memorando }}': memo,
      '{{ data_do_dia }}': dataHoje,
      '{{ NUMERO_PROTOCOLO }}': protocol,
      '{{ NUMERO_ATA }}': process.numeroAta || '---',
      '{{ VALIDADE_ATA }}': process.validadeAta || '---',
      '{{ NUMERO_PE }}': process.ataPregao,
      '{{ SOMA_TOTAL }}': formattedTotal,
      '{{ assunto_memo }}': process.aiSubject || `Aquisição referente ao Pregão ${process.ataPregao}`,
      '{{ pe_numero }}': process.ataPregao,
      '{{ texto_ia_motivacao }}': process.aiMotivation || 'reposição de estoque...',
      '{{ nome_usuario }}': currentUser ? currentUser.name : 'Usuário',
    };

    const loopRegex = /{% tr for item in .*? %}([\s\S]*?){% endtr %}/g;
    fileContent = fileContent.replace(loopRegex, (match, rowTemplate) => {
      return process.items.map(item => {
        let rowHtml = rowTemplate;
        const itemReplacements: Record<string, string> = {
          '{{ item.lote }}': item.lote,
          '{{ item.codigo_gms }}': item.gmsCode || '-',
          '{{ item.item_descricao }}': item.descricao,
          '{{ item.quantidade_solicitada }}': item.quantidade.toString(),
          '{{ item.valor_unitario }}': formatCurrency(item.valorUnitario),
          '{{ item.valor_total }}': formatCurrency((item.valorUnitario || 0) * item.quantidade),
          '{{ item.consumo_anual }}': item.consolidadoDT,
          '{{ item.estoque_atual }}': item.estoqueAtual.toString()
        };
        Object.entries(itemReplacements).forEach(([k, v]) => { rowHtml = rowHtml.split(k).join(v); });
        return rowHtml;
      }).join('');
    });

    Object.entries(replacements).forEach(([key, value]) => { fileContent = fileContent.split(key).join(value); });

    const blob = new Blob(['\uFEFF', fileContent], { type: 'application/msword;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${process.id}_${template.fileName}`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleUpdateTemplate = (id: string, file: File) => {
    setTemplates(prev => prev.map(t => t.id === id ? { ...t, fileName: file.name, lastUpdated: new Date().toLocaleDateString() } : t));
    alert(`Modelo "${file.name}" atualizado com sucesso!`);
  };

  const handleCreateRequest = (e: React.FormEvent) => {
    e.preventDefault();
    const process: ProcessData & { priority?: ProcessPriority } = {
      id: `REQ-${Math.floor(Math.random() * 10000)}`,
      requesterName: currentUser ? currentUser.name : 'Desconhecido',
      createdAt: new Date().toISOString(),
      status: ProcessStatus.PENDING,
      ataPregao: newRequestAta,
      items: newRequestItems,
      priority: ProcessPriority.NORMAL // Padrão
    };
    setProcesses([process, ...processes]);
    setNewRequestAta('');
    setNewRequestItems([{ lote: '', gmsCode: '', quantidade: 0, consolidadoDT: '', estoqueAtual: 0, descricao: '' }]);
    setActiveTab('dashboard');
    alert("Pedido criado com sucesso!");
  };

  const handleDistribute = (id: string, analystName: string) => {
    if (!analystName) {
        alert("Selecione um analista!");
        return;
    }
    setProcesses(prev => prev.map(p => p.id === id ? { 
        ...p, 
        status: ProcessStatus.DISTRIBUTED, 
        assignedTo: analystName, 
        distributedAt: new Date().toISOString(),
        priority: distributePriority 
    } : p));
    setSelectedProcess(null);
    setDistributeTo('');
  };

  const handleUpdateProtocol = () => {
    if (!selectedProcess) return;
    setProcesses(prev => prev.map(p => p.id === selectedProcess.id ? { ...p, protocolNumber: protocolEditMode } : p));
    setSelectedProcess(prev => prev ? { ...prev, protocolNumber: protocolEditMode } : null);
    setIsEditingProtocol(false);
    setProtocolEditMode('');
  };

  const handleUpdateProcessField = (id: string, field: keyof ProcessData, value: any) => {
    setProcesses(prev => prev.map(p => p.id === id ? { ...p, [field]: value } : p));
    if (selectedProcess && selectedProcess.id === id) {
        setSelectedProcess(curr => curr ? { ...curr, [field]: value } : null);
    }
  };

  const handleUpdateItemPrice = (processId: string, itemIndex: number, price: number) => {
    if (selectedProcess && selectedProcess.id === processId) {
      const updatedItems = [...selectedProcess.items];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], valorUnitario: price };
      const newTotal = updatedItems.reduce((sum, item) => sum + (item.quantidade * (item.valorUnitario || 0)), 0);
      const updatedProcess = { ...selectedProcess, items: updatedItems, totalValue: newTotal };
      setSelectedProcess(updatedProcess);
      setProcesses(prev => prev.map(p => p.id === processId ? updatedProcess : p));
    }
  };

  const handleUpdateItemSupplier = (processId: string, itemIndex: number, field: 'supplierName' | 'supplierCNPJ', value: string) => {
    if (selectedProcess && selectedProcess.id === processId) {
      const updatedItems = [...selectedProcess.items];
      updatedItems[itemIndex] = { ...updatedItems[itemIndex], [field]: value };
      const updatedProcess = { ...selectedProcess, items: updatedItems };
      setSelectedProcess(updatedProcess);
      setProcesses(prev => prev.map(p => p.id === processId ? updatedProcess : p));
    }
  };

  const handleSaveDraft = () => {
    if (!selectedProcess) return;
    const updatedProcess = { 
      ...selectedProcess, 
      memoNumber: analystInput.memo || selectedProcess.memoNumber, 
    };
    setProcesses(prev => prev.map(p => p.id === selectedProcess.id ? updatedProcess : p));
    setSelectedProcess(updatedProcess);
    alert("Alterações salvas no rascunho com sucesso!");
  };

  const handleFinalizeProcess = () => {
    if (!selectedProcess) return;
    setProcesses(prev => prev.map(p => 
      p.id === selectedProcess.id ? { 
        ...p, 
        status: ProcessStatus.COMPLETED, 
        memoNumber: analystInput.memo, 
        protocolNumber: p.protocolNumber,
        completedAt: new Date().toISOString()
      } : p
    ));
    setSelectedProcess(null);
    setAnalystInput({ memo: '' });
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    setUsers([...users, { id: `u${users.length + 1}`, name: newUser.name, role: newUser.role, active: true }]);
    setNewUser({ name: '', role: Role.REQUESTER });
  };

  const toggleUserStatus = (id: string) => {
    setUsers(users.map(u => u.id === id ? { ...u, active: !u.active } : u));
  };

  const handleAddProductGroup = (e: React.FormEvent) => {
    e.preventDefault();
    setProductGroups([...productGroups, { id: `pg-${productGroups.length + 1}`, name: newProductGroup }]);
    setNewProductGroup('');
  };

  const runAnalysis = async (p: ProcessData) => {
    setIsAiLoading(true);
    const analysis = await analyzeRequestFeasibility(p);
    setAiAnalysis(analysis);
    setIsAiLoading(false);
  };

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '-';
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const getStatusColor = (status: ProcessStatus) => {
    switch (status) {
      case ProcessStatus.PENDING: return 'bg-amber-100 text-amber-700 border-amber-200';
      case ProcessStatus.DISTRIBUTED: return 'bg-blue-100 text-blue-700 border-blue-200';
      case ProcessStatus.COMPLETED: return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority?: ProcessPriority) => {
    switch (priority) {
      case ProcessPriority.HIGH: return 'text-red-600 bg-red-50 border-red-200';
      case ProcessPriority.LOW: return 'text-green-600 bg-green-50 border-green-200';
      default: return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getPriorityIcon = (priority?: ProcessPriority) => {
    switch (priority) {
        case ProcessPriority.HIGH: return <ArrowUp size={14} />;
        case ProcessPriority.LOW: return <ArrowDown size={14} />;
        default: return <Minus size={14} />;
    }
  };

  const getCustomStatusBadge = (id?: string) => {
    const opt = statusOptions.find(o => o.id === id);
    if (!opt) return null;
    return <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ml-2 ${opt.color}`}>{opt.label}</span>;
  };

  const getDaysOpen = (dateString: string) => {
    const created = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - created.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  };

  const isProcessDelayed = (p: ProcessData) => {
    if (p.status === ProcessStatus.COMPLETED) return false;
    return getDaysOpen(p.createdAt) > SLA_DAYS_LIMIT;
  };

  const isAnalystWorkComplete = () => {
    if (!selectedProcess) return false;
    if (!selectedProcess.numeroAta || !selectedProcess.validadeAta) return false;
    const hasMemo = analystInput.memo || selectedProcess.memoNumber;
    const hasProtocol = selectedProcess.protocolNumber;
    if (!hasMemo || !hasProtocol) return false;
    const itemsValid = selectedProcess.items.every(item => {
      const i = item as any;
      return ((item.valorUnitario || 0) > 0 && i.supplierName && i.supplierName.trim() !== '' && i.supplierCNPJ && i.supplierCNPJ.trim() !== '');
    });
    return itemsValid;
  };

  // 3. RENDER FUNCTIONS
  const renderNewRequestForm = () => (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-100">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-2">
        <FilePlus className="text-blue-500" /> Novo Pedido de Compra
      </h2>
      <form onSubmit={handleCreateRequest} className="space-y-8">
        <div className="bg-slate-50 p-6 rounded-lg border border-slate-200">
          <label className="block text-sm font-bold text-slate-700 mb-1">Nº PE / Ata Global</label>
          <input required type="text" className="w-full md:w-1/2 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none bg-white" value={newRequestAta} onChange={e => setNewRequestAta(e.target.value)} placeholder="Ex: 12/2023" />
        </div>
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2"><Package size={20} /> Itens do Pedido</h3>
          {newRequestItems.map((item, index) => (
            <div key={index} className="relative bg-white border border-slate-200 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
              <div className="absolute top-4 right-4 flex gap-2">
                <span className="text-xs font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded">Item #{index + 1}</span>
                {newRequestItems.length > 1 && (
                  <button type="button" onClick={() => handleRemoveItem(index)} className="text-red-400 hover:text-red-600 p-1 hover:bg-red-50 rounded"><Trash2 size={16} /></button>
                )}
              </div>
              <div className="mb-4 bg-green-50 p-3 rounded-lg border border-green-100">
                <label className="block text-xs font-bold text-green-800 uppercase mb-1 flex items-center gap-1"><Database size={12}/> Código GMS</label>
                <div className="flex gap-2">
                  <input type="text" className="flex-1 px-3 py-2 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 text-sm bg-white" value={item.gmsCode || ''} onChange={e => handleUpdateItem(index, 'gmsCode', e.target.value)} onBlur={(e) => { if(e.target.value) handleGmsSearch(index, e.target.value); }} placeholder="Digite o ID (ex: 102030) e tecle Tab..." />
                  <button type="button" onClick={() => item.gmsCode && handleGmsSearch(index, item.gmsCode)} className="bg-green-600 text-white px-3 rounded-lg hover:bg-green-700"><Search size={16}/></button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Lote</label><input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" value={item.lote} onChange={e => handleUpdateItem(index, 'lote', e.target.value)} placeholder="Ex: 05"/></div>
                <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Quantidade</label><input required type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" value={item.quantidade || ''} onChange={e => handleUpdateItem(index, 'quantidade', Number(e.target.value))}/></div>
                <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Consol. DT</label><input required type="text" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" value={item.consolidadoDT} readOnly/></div>
                <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Estoque</label><input required type="number" className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" value={item.estoqueAtual || ''} readOnly/></div>
              </div>
              <div><label className="block text-xs font-semibold text-slate-500 uppercase mb-1">Descrição</label><textarea required rows={2} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-sm" value={item.descricao} readOnly/></div>
            </div>
          ))}
          <button type="button" onClick={handleAddItem} className="w-full py-3 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-medium hover:border-blue-400 hover:text-blue-500 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"><Plus size={20} /> Adicionar Outro Lote</button>
        </div>
        <div className="flex justify-end gap-3 pt-6 border-t border-slate-200">
           <button type="button" onClick={() => setActiveTab('dashboard')} className="px-6 py-2 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors">Cancelar</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/30 flex items-center gap-2"><Send size={18} /> Enviar Pedido ({newRequestItems.length} itens)</button>
        </div>
      </form>
    </div>
  );

  const renderProcessModal = () => {
    if (!selectedProcess) return null;
    
    // VISÃO DE TELAS (O que está sendo exibido)
    const isManagerView = role === Role.MANAGER;
    
    // VISÃO DE FINANCEIRO (Aparece se NÃO FOR TELA DE GERENTE)
    // Se o Gerente quiser ver financeiro, ele deve clicar em "Analista" no menu lateral
    const showFinancialPanel = !isManagerView;

    const canEditProtocol = role === Role.ANALYST || role === Role.MANAGER || role === Role.ADMIN;
    const canFinalize = isAnalystWorkComplete();

    return (
      <div className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div ref={modalRef} className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white border-b border-slate-100 p-6 flex justify-between items-start z-10">
            <div>
              <div className="flex items-center gap-3 mb-1">
                <h2 className="text-xl font-bold text-slate-800">Processo {selectedProcess.id}</h2>
                <span className={`px-2 py-0.5 rounded text-xs font-bold border ${getStatusColor(selectedProcess.status)}`}>{selectedProcess.status}</span>
                {getCustomStatusBadge(selectedProcess.customStatusId)}
                {selectedProcess.priority && (
                     <span className={`px-2 py-0.5 rounded text-xs font-bold border flex items-center gap-1 ${getPriorityColor(selectedProcess.priority)}`}>
                        {getPriorityIcon(selectedProcess.priority)} {selectedProcess.priority}
                     </span>
                )}
              </div>
              <p className="text-sm text-slate-500">Criado em {new Date(selectedProcess.createdAt).toLocaleDateString()} por {selectedProcess.requesterName}</p>
            </div>
            <button onClick={() => setSelectedProcess(null)} className="p-2 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600"><LogOut size={20} className="rotate-45" /></button>
          </div>

          <div className="p-6 flex flex-col gap-8">
            <div className="bg-slate-50 p-5 rounded-xl border border-slate-200">
              <h3 className="font-bold text-slate-700 mb-4 flex items-center gap-2 text-sm uppercase tracking-wide"><FileText size={16} /> Resumo do Pedido e Protocolo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                   <h4 className="text-xs font-bold text-blue-800 uppercase mb-2 flex items-center gap-2"><Tag size={14}/> Número de Protocolo <span className="text-red-500">*</span></h4>
                   {isEditingProtocol ? (
                    <div className="flex gap-2">
                      <input type="text" className="flex-1 text-sm border border-blue-300 rounded px-2 py-1 focus:outline-none" value={protocolEditMode} onChange={(e) => setProtocolEditMode(e.target.value)} />
                      <button onClick={handleUpdateProtocol} className="text-blue-600 hover:bg-blue-100 p-1 rounded"><Save size={16} /></button>
                      <button onClick={() => setIsEditingProtocol(false)} className="text-red-400 hover:bg-red-50 p-1 rounded"><X size={16} /></button>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center"><span className="text-lg font-mono font-bold text-blue-900">{selectedProcess.protocolNumber || "---"}</span>{canEditProtocol && selectedProcess.status !== ProcessStatus.COMPLETED && (<button onClick={() => { setIsEditingProtocol(true); setProtocolEditMode(selectedProcess.protocolNumber || ''); }} className="text-xs text-blue-600 hover:underline">Editar</button>)}</div>
                  )}
                </div>

                {role !== Role.REQUESTER && selectedProcess.status !== ProcessStatus.COMPLETED && (
                   <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm">
                      <label className="text-xs font-bold text-slate-500 uppercase mb-2 block">Status Interno</label>
                      <select className="w-full text-sm border border-slate-300 rounded-lg p-2 bg-white" value={selectedProcess.customStatusId || ''} onChange={(e) => handleUpdateProcessField(selectedProcess.id, 'customStatusId', e.target.value)}>
                        <option value="">Selecione um status...</option>
                        {statusOptions.map(opt => (<option key={opt.id} value={opt.id}>{opt.label}</option>))}
                      </select>
                   </div>
                )}
                <div className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm"><span className="block text-slate-500 text-xs uppercase tracking-wider mb-1">Ata / Pregão Global</span><span className="font-bold text-slate-800 text-lg">{selectedProcess.ataPregao}</span></div>
              </div>
              <div className="border-t border-slate-200 pt-4">
                 <h4 className="text-xs font-bold text-slate-500 uppercase mb-3">Itens Solicitados (Visualização Rápida)</h4>
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {selectedProcess.items.map((item, idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200 text-sm shadow-sm relative overflow-hidden group hover:border-blue-300 transition-colors">
                          <div className="absolute top-0 right-0 bg-slate-100 text-[10px] font-bold px-2 py-0.5 rounded-bl text-slate-500">Item {idx + 1}</div>
                          <div className="font-bold text-slate-800 mb-1">Lote {item.lote}</div>
                          <div className="text-slate-600 text-xs line-clamp-2 mb-2 h-8" title={item.descricao}>{item.descricao}</div>
                          <div className="flex justify-between items-center text-xs text-slate-500 border-t border-slate-100 pt-2"><span>Qtd: <strong className="text-slate-700">{item.quantidade}</strong></span><span>Estoque: <strong className={item.estoqueAtual < 10 ? 'text-red-500' : 'text-slate-700'}>{item.estoqueAtual}</strong></span></div>
                      </div>
                    ))}
                 </div>
              </div>
            </div>

            <div className="space-y-6">
              {/* PAINEL DE DISTRIBUIÇÃO (Só aparece na tela do Gerente quando no modo Gerente) */}
              {isManagerView && (selectedProcess.status === ProcessStatus.PENDING || selectedProcess.status === ProcessStatus.DISTRIBUTED) && (
                <div className="space-y-6 animate-fade-in">
                  <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-5">
                    <div className="flex items-center gap-2 mb-2 text-indigo-700 font-bold"><Bot size={20} /> Análise Preliminar (IA)</div>
                    {isAiLoading && !aiAnalysis ? <div className="flex items-center gap-2 text-sm text-indigo-600"><div className="animate-spin h-4 w-4 border-2 border-indigo-600 border-t-transparent rounded-full"></div>Analisando...</div> : <p className="text-sm text-indigo-900 leading-relaxed whitespace-pre-wrap">{aiAnalysis || "Clique em distribuir para ver análise."}</p>}
                  </div>
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                    <h3 className="font-bold text-slate-800 mb-4">{selectedProcess.status === ProcessStatus.DISTRIBUTED ? 'Redistribuir Processo' : 'Distribuir Processo'}</h3>
                    <div className="flex flex-col md:flex-row gap-4">
                       <div className="w-full md:w-1/4">
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Prioridade</label>
                            <select 
                                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                value={distributePriority}
                                onChange={(e) => setDistributePriority(e.target.value as ProcessPriority)}
                            >
                                {Object.values(ProcessPriority).map(p => <option key={p} value={p}>{p}</option>)}
                            </select>
                       </div>
                       <div className="flex-1">
                            <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Analista Responsável</label>
                            <div className="flex gap-2">
                                <select 
                                    className="flex-1 border border-slate-300 rounded-lg px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500"
                                    value={distributeTo}
                                    onChange={(e) => setDistributeTo(e.target.value)}
                                >
                                    <option value="">Selecione um analista...</option>
                                    {users.filter(u => u.role === Role.ANALYST && u.active).map(u => (
                                    <option key={u.id} value={u.name}>{u.name}</option>
                                    ))}
                                </select>
                                <button onClick={() => handleDistribute(selectedProcess.id, distributeTo)} className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                                    {selectedProcess.status === ProcessStatus.DISTRIBUTED ? 'Salvar Redistribuição' : 'Distribuir'}
                                </button>
                            </div>
                       </div>
                    </div>
                    {selectedProcess.status === ProcessStatus.DISTRIBUTED && (
                        <p className="mt-2 text-xs text-orange-600 flex items-center gap-1"><Info size={12}/> Atenção: Este processo já está atribuído a {selectedProcess.assignedTo}.</p>
                    )}
                  </div>
                </div>
              )}

              {/* PAINEL FINANCEIRO E DOCUMENTOS (Aparece para Analista Real ou Gerente em modo Supervisão/Analista) */}
              {showFinancialPanel && selectedProcess.status !== ProcessStatus.PENDING && (
                <div className="space-y-8 animate-fade-in">
                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><DollarSign size={20} className="text-orange-500" /> Dados Financeiros e Classificação</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 uppercase">Grupo de Produtos</label>
                          <select className="w-full border border-slate-300 rounded p-2 mt-1 text-sm bg-white" value={selectedProcess.productGroupId || ''} onChange={(e) => handleUpdateProcessField(selectedProcess.id, 'productGroupId', e.target.value)}>
                            <option value="">Selecione...</option>
                            {productGroups.map(pg => (<option key={pg.id} value={pg.id}>{pg.name}</option>))}
                          </select>
                        </div>
                        <div>
                           <label className="text-xs font-semibold text-slate-500 uppercase">Valor Total do Processo</label>
                           <div className="mt-1 p-2 bg-slate-50 border border-slate-200 rounded text-slate-800 font-bold text-sm">{formatCurrency(selectedProcess.items.reduce((acc, i) => acc + (i.quantidade * (i.valorUnitario || 0)), 0))}</div>
                        </div>
                      </div>
                  </div>

                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><Calculator size={20} className="text-blue-500" /> Dados da Ata e Precificação</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 p-4 bg-slate-50 rounded-lg border border-slate-100">
                         <div><label className="text-xs font-semibold text-slate-500 uppercase">Nº da Ata (Analista) <span className="text-red-500">*</span></label><input type="text" className="w-full border border-slate-300 rounded p-2 mt-1 text-sm bg-white" placeholder="Ex: 055/2024" value={selectedProcess.numeroAta || ''} onChange={(e) => handleUpdateProcessField(selectedProcess.id, 'numeroAta', e.target.value)}/></div>
                         <div><label className="text-xs font-semibold text-slate-500 uppercase">Validade da Ata <span className="text-red-500">*</span></label><input type="text" className="w-full border border-slate-300 rounded p-2 mt-1 text-sm bg-white" placeholder="Ex: 12/12/2025" value={selectedProcess.validadeAta || ''} onChange={(e) => handleUpdateProcessField(selectedProcess.id, 'validadeAta', e.target.value)}/></div>
                      </div>

                      <div className="overflow-x-auto rounded-lg border border-slate-200">
                        <table className="w-full text-sm text-left">
                           <thead className="bg-slate-100 text-xs text-slate-500 uppercase font-semibold">
                              <tr><th className="px-4 py-3">Lote</th><th className="px-4 py-3">Descrição</th><th className="px-4 py-3 w-24 text-center">Qtd</th><th className="px-4 py-3 w-32 text-right">Valor Unit. <span className="text-red-500">*</span></th><th className="px-4 py-3 text-right">Total Item</th></tr>
                           </thead>
                           <tbody className="divide-y divide-slate-100">
                              {selectedProcess.items.map((item, idx) => {
                                const i = item as any;
                                const rowTotal = item.quantidade * (item.valorUnitario || 0);
                                return (
                                  <React.Fragment key={idx}>
                                    <tr className="bg-white hover:bg-slate-50 transition-colors">
                                       <td className="px-4 py-3 font-medium align-top pt-4 text-slate-900">{item.lote}</td>
                                       <td className="px-4 py-3 align-top pt-4"><p className="font-medium text-slate-800">{item.descricao}</p><p className="text-xs text-slate-400 mt-0.5">Código GMS: {item.gmsCode || '-'}</p></td>
                                       <td className="px-4 py-3 text-center align-top pt-4 font-bold text-slate-700">{item.quantidade}</td>
                                       <td className="px-4 py-3 align-top pt-3"><div className="flex items-center justify-end gap-1"><span className="text-slate-400 text-xs">R$</span><input type="number" step="0.01" className="w-24 border border-slate-300 rounded px-2 py-1 text-xs text-right focus:ring-2 focus:ring-blue-500 outline-none font-medium" value={item.valorUnitario || ''} onChange={(e) => handleUpdateItemPrice(selectedProcess.id, idx, parseFloat(e.target.value))} placeholder="0.00"/></div></td>
                                       <td className="px-4 py-3 text-right font-bold text-slate-700 align-top pt-4">{formatCurrency(rowTotal)}</td>
                                    </tr>
                                    <tr className="bg-slate-50 border-b border-slate-200">
                                       <td colSpan={5} className="px-4 py-3 pb-4">
                                         <div className="flex flex-col sm:flex-row gap-4 ml-0 sm:ml-12 p-3 bg-white border border-slate-200 rounded-lg shadow-sm">
                                             <div className="flex-1"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">Razão Social do Fornecedor <span className="text-red-500">*</span></label><input type="text" className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 text-slate-700" value={i.supplierName || ''} onChange={(e) => handleUpdateItemSupplier(selectedProcess.id, idx, 'supplierName', e.target.value)} placeholder="Digite o nome do fornecedor..."/></div>
                                             <div className="w-full sm:w-48"><label className="text-[10px] font-bold text-slate-500 uppercase mb-1 block">CNPJ <span className="text-red-500">*</span></label><input type="text" className="w-full border border-slate-300 rounded px-3 py-1.5 text-xs focus:ring-1 focus:ring-blue-500 text-slate-700" value={i.supplierCNPJ || ''} onChange={(e) => handleUpdateItemSupplier(selectedProcess.id, idx, 'supplierCNPJ', e.target.value)} placeholder="00.000.000/0000-00"/></div>
                                         </div>
                                       </td>
                                    </tr>
                                  </React.Fragment>
                                );
                              })}
                           </tbody>
                        </table>
                      </div>
                  </div>

                  {!selectedProcess.protocolNumber && (<div className="bg-amber-50 border border-amber-200 rounded-lg p-3 flex items-start gap-3 text-sm text-amber-800"><AlertCircle size={18} className="mt-0.5 shrink-0"/><p>Por favor, gere o número de protocolo no painel "Resumo do Pedido" acima para liberar os documentos.</p></div>)}

                  <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2"><FileCheck size={20} className="text-teal-500" /> Montagem do Processo</h3>
                      <div className="mb-4"><label className="text-xs font-semibold text-slate-500 uppercase">Nº Memorando <span className="text-red-500">*</span></label><input type="text" className="w-full md:w-1/2 border border-slate-300 rounded p-2 mt-1 text-sm" placeholder="Ex: 2024/099" value={analystInput.memo} onChange={(e) => setAnalystInput({...analystInput, memo: e.target.value})}/></div>
                      <div className="mt-6 mb-6 pt-6 border-t border-slate-100">
                        <div className="flex justify-between items-center mb-3"><h4 className="text-sm font-bold text-slate-700 flex items-center gap-2"><File size={16} className="text-blue-500"/> Documentos Padronizados</h4><button onClick={handleGenerateAiFields} disabled={isAiFieldsLoading} className="text-xs bg-purple-100 text-purple-700 px-3 py-1.5 rounded-lg font-bold hover:bg-purple-200 flex items-center gap-1 transition-colors">{isAiFieldsLoading ? <RefreshCw size={12} className="animate-spin"/> : <Bot size={12}/>} Gerar Metadados IA (Assunto/Motivação)</button></div>
                        {(selectedProcess.aiSubject || selectedProcess.aiMotivation) && (<div className="mb-4 bg-purple-50 p-3 rounded text-xs text-purple-900 border border-purple-100"><p><strong>Assunto IA:</strong> {selectedProcess.aiSubject}</p><p className="mt-1"><strong>Motivação IA:</strong> {selectedProcess.aiMotivation}</p></div>)}
                        <p className="text-xs text-slate-500 mb-3">Templates atualizados em 09/12/2025.</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {templates.map(tmpl => {
                            const isReady = (analystInput.memo || selectedProcess.memoNumber) && selectedProcess.protocolNumber;
                            return (<button key={tmpl.id} onClick={() => isReady && generateFileFromTemplate(tmpl, selectedProcess, analystInput.memo || selectedProcess.memoNumber || '---', selectedProcess.protocolNumber || '---')} disabled={!isReady} className={`flex items-center gap-3 p-3 rounded-lg border text-left transition-all ${isReady ? 'bg-blue-50 border-blue-200 hover:bg-blue-100 cursor-pointer' : 'bg-slate-50 border-slate-200 opacity-60 cursor-not-allowed'}`}><div className={`p-2 rounded-full ${tmpl.type === 'docx' ? 'bg-blue-200 text-blue-700' : 'bg-green-200 text-green-700'}`}>{tmpl.type === 'docx' ? <FileText size={16}/> : <FileSpreadsheet size={16}/>}</div><div><span className="block text-xs font-bold text-slate-700">{tmpl.name}</span><span className="block text-[10px] text-slate-500">{isReady ? 'Clique para baixar' : 'Preencha Memo e Protocolo'}</span></div></button>)
                          })}
                        </div>
                      </div>
                      <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
                         <button onClick={handleSaveDraft} className="bg-slate-100 hover:bg-slate-200 text-slate-700 px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"><Save size={18} /> Salvar Rascunho</button>
                        <div className="flex flex-col items-end">
                          <button onClick={handleFinalizeProcess} disabled={!canFinalize} className={`px-6 py-2 rounded-lg font-medium transition-colors shadow-lg flex items-center gap-2 text-white ${canFinalize ? 'bg-green-600 hover:bg-green-700 shadow-green-500/30' : 'bg-gray-300 cursor-not-allowed'}`}><CheckCircle size={18} /> Finalizar e Salvar</button>
                          {!canFinalize && (<div className="mt-2 text-xs text-red-500 flex items-center gap-1"><Info size={12}/> Preencha todos os campos obrigatórios (*)</div>)}
                        </div>
                      </div>
                  </div>
                </div>
              )}

              {selectedProcess.status === ProcessStatus.COMPLETED && (
                <div className="bg-green-50 border border-green-100 rounded-xl p-6 text-center">
                  <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle size={32} /></div>
                  <h3 className="text-xl font-bold text-green-800 mb-2">Processo Concluído</h3>
                  <p className="text-green-700 mb-6">Todos os documentos foram gerados e protocolados.</p>
                  <div className="bg-white rounded-lg p-4 text-left shadow-sm border border-green-100 max-w-md mx-auto">
                    <div className="flex justify-between text-sm mb-2 border-b border-green-50 pb-2"><span className="text-slate-500">Memorando:</span><span className="font-mono font-bold text-slate-800">{selectedProcess.memoNumber}</span></div>
                    <div className="flex justify-between text-sm mb-4 border-b border-green-50 pb-2"><span className="text-slate-500">Protocolo:</span><span className="font-mono font-bold text-slate-800">{selectedProcess.protocolNumber}</span></div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminPanel = () => {
    // Bloqueia acesso se for Analista Real tentando acessar
    if (currentUser?.role === Role.ANALYST) return null;

    if (activeTab === 'admin-users') {
      return (
        <div className="space-y-6 animate-fade-in">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
               <UserPlus size={20} className="text-blue-500"/> Adicionar Novo Usuário
             </h3>
             <form onSubmit={handleAddUser} className="flex gap-4 items-end">
               <div className="flex-1">
                 <label className="block text-xs font-semibold text-slate-500 mb-1">Nome Completo</label>
                 <input required type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} className="w-full border border-slate-300 rounded-lg px-4 py-2"/>
               </div>
               <div className="flex-1">
                 <label className="block text-xs font-semibold text-slate-500 mb-1">Perfil de Acesso</label>
                 <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value as Role})} className="w-full border border-slate-300 rounded-lg px-4 py-2">
                    {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                 </select>
               </div>
               <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-blue-700">Adicionar</button>
             </form>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4">Usuários Cadastrados</h3>
             <table className="w-full text-left text-sm">
               <thead className="bg-slate-50 text-xs uppercase text-slate-500">
                 <tr><th className="px-4 py-3">Nome</th><th className="px-4 py-3">Perfil</th><th className="px-4 py-3">Status</th><th className="px-4 py-3 text-right">Ação</th></tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                 {users.map(u => (
                   <tr key={u.id}>
                     <td className="px-4 py-3 font-medium">{u.name}</td>
                     <td className="px-4 py-3">{u.role}</td>
                     <td className="px-4 py-3"><span className={`px-2 py-0.5 rounded-full text-xs ${u.active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.active ? 'Ativo' : 'Inativo'}</span></td>
                     <td className="px-4 py-3 text-right"><button onClick={() => toggleUserStatus(u.id)} className="text-slate-400 hover:text-blue-600" title="Alternar Status"><Power size={18} /></button></td>
                   </tr>
                 ))}
               </tbody>
             </table>
           </div>
        </div>
      );
    }
    if (activeTab === 'admin-config') {
      return (
        <div className="space-y-6 animate-fade-in">
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <div className="flex items-center justify-between mb-4">
               <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Database size={20} className="text-green-600"/> Integração Google Sheets (GMS)</h3>
               <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1 rounded-full border border-slate-200 flex items-center gap-1"><Calendar size={12}/> Última carga: {lastSyncDate}</span>
             </div>
             <div className="bg-green-50 border border-green-100 p-4 rounded-lg mb-6"><p className="text-sm text-green-800 flex items-center gap-2"><CheckCircle size={16} /> Banco de dados sincronizado. {sheetData.length} produtos disponíveis para busca.</p></div>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
               <div className="border-2 border-dashed border-slate-300 rounded-xl p-8 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-white transition-colors">
                  <input type="file" accept=".csv" className="hidden" id="csvUpload" ref={fileInputRef} onChange={handleFileUpload}/>
                  <div className="p-4 bg-blue-50 text-blue-500 rounded-full mb-3"><Upload size={32} /></div>
                  <h4 className="font-bold text-slate-700 mb-1">Carregar nova planilha</h4>
                  <button onClick={() => fileInputRef.current?.click()} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 flex items-center gap-2"><FileSpreadsheet size={16} /> Selecionar Arquivo</button>
               </div>
               <div className="space-y-4">
                 <h4 className="font-bold text-slate-700 text-sm uppercase">Instruções de Importação</h4>
                 <ul className="text-sm text-slate-600 space-y-2 list-disc pl-4"><li>O arquivo deve ser formato <strong>.CSV</strong>.</li><li>A ordem das colunas deve ser: FAMILIA; ID; DESCRIÇÃO; CONSOLIDADO_DT; ESTOQUE</li></ul>
                 <div className="pt-4 border-t border-slate-100"><button onClick={downloadTemplate} className="text-blue-600 hover:text-blue-800 text-sm font-medium flex items-center gap-2 hover:underline"><Download size={16} /> Baixar modelo (.csv)</button></div>
               </div>
             </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><FileText size={20} className="text-blue-600"/> Gestão de Modelos de Documentos</h3>
              <p className="text-sm text-slate-500 mb-4">Modelos de arquivos usados pelos analistas (docx/xlsx).</p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {templates.map(tmpl => (
                    <div key={tmpl.id} className="p-4 border border-slate-200 rounded-lg bg-slate-50 hover:bg-slate-100 transition-colors">
                       <div className="flex items-center gap-3 mb-2">
                          <div className={`p-2 rounded ${tmpl.type === 'docx' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>{tmpl.type === 'docx' ? <FileText size={20}/> : <FileSpreadsheet size={20}/>}</div>
                          <div><h4 className="font-bold text-slate-800 text-sm">{tmpl.name}</h4><p className="text-[10px] text-slate-500">{tmpl.fileName}</p></div>
                       </div>
                       <div className="flex justify-between items-center mt-3">
                          <span className="text-[10px] text-slate-400">Atualizado: {tmpl.lastUpdated}</span>
                          <label className="cursor-pointer text-xs text-blue-600 hover:underline font-bold">Substituir<input type="file" className="hidden" accept={tmpl.type === 'docx' ? '.docx' : '.xlsx'} onChange={(e) => e.target.files && handleUpdateTemplate(tmpl.id, e.target.files[0])}/></label>
                       </div>
                    </div>
                  ))}
              </div>
           </div>
           <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
             <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><Layers size={20} className="text-orange-500"/> Grupos de Produtos</h3>
             <form onSubmit={handleAddProductGroup} className="flex gap-4 items-end mb-6">
               <div className="flex-1">
                 <label className="block text-xs font-semibold text-slate-500 mb-1">Nome do Grupo</label>
                 <input required type="text" value={newProductGroup} onChange={e => setNewProductGroup(e.target.value)} className="w-full border border-slate-300 rounded-lg px-4 py-2"/>
               </div>
               <button type="submit" className="bg-orange-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-orange-700">Adicionar</button>
             </form>
             <div className="flex flex-wrap gap-2">
               {productGroups.map(pg => (
                 <div key={pg.id} className="px-3 py-1.5 bg-slate-100 rounded-full border border-slate-200 flex items-center gap-2 text-sm text-slate-700">{pg.name}<button onClick={() => setProductGroups(productGroups.filter(g => g.id !== pg.id))} className="text-slate-400 hover:text-red-500" title="Excluir"><Trash2 size={14} /></button></div>
               ))}
             </div>
           </div>
        </div>
      );
    }
    return null;
  };

  const renderReports = () => {
    // Bloqueia acesso se for Analista Real
    if (currentUser?.role === Role.ANALYST) return null;

    // Cálculo dos dados para os gráficos
    const statusCount = [
        { name: 'Pendente', value: processes.filter(p => p.status === ProcessStatus.PENDING).length, color: '#f59e0b' },
        { name: 'Distribuído', value: processes.filter(p => p.status === ProcessStatus.DISTRIBUTED).length, color: '#3b82f6' },
        { name: 'Concluído', value: processes.filter(p => p.status === ProcessStatus.COMPLETED).length, color: '#22c55e' },
    ].filter(d => d.value > 0);

    // Valor total por grupo
    const groupValueMap: Record<string, number> = {};
    processes.forEach(p => {
        if (p.productGroupId && p.totalValue) {
            const groupName = productGroups.find(g => g.id === p.productGroupId)?.name || 'Outros';
            groupValueMap[groupName] = (groupValueMap[groupName] || 0) + p.totalValue;
        }
    });
    
    const groupData = Object.entries(groupValueMap).map(([name, value]) => ({ name, value }));

    return (
        <div className="space-y-6 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><PieChart size={20} className="text-purple-500"/> Status dos Pedidos</h3>
                    <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie data={statusCount} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                    {statusCount.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                    <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><BarChart3 size={20} className="text-blue-500"/> Valor por Grupo de Produto</h3>
                    <div className="h-64">
                         {groupData.length > 0 ? (
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={groupData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" fontSize={12} tickMargin={10}/>
                                    <YAxis fontSize={12} tickFormatter={(value) => `R$${value/1000}k`}/>
                                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                                    <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                         ) : (
                             <div className="h-full flex items-center justify-center text-slate-400 text-sm">Sem dados financeiros suficientes.</div>
                         )}
                    </div>
                </div>
             </div>
             
             <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2"><TrendingUp size={20} className="text-green-600"/> Indicadores Gerais</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase font-bold">Total de Processos</p>
                        <p className="text-2xl font-bold text-slate-800">{processes.length}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase font-bold">Valor Total Acumulado</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(processes.reduce((acc, p) => acc + (p.totalValue || 0), 0))}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase font-bold">Itens Solicitados</p>
                        <p className="text-2xl font-bold text-slate-800">{processes.reduce((acc, p) => acc + p.items.length, 0)}</p>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-lg border border-slate-200">
                        <p className="text-xs text-slate-500 uppercase font-bold">Ticket Médio</p>
                        <p className="text-2xl font-bold text-slate-800">{formatCurrency(processes.reduce((acc, p) => acc + (p.totalValue || 0), 0) / (processes.filter(p => p.totalValue).length || 1))}</p>
                    </div>
                </div>
             </div>
        </div>
    );
  };

  const renderDashboard = () => {
    let filteredProcesses = processes;

    // --- REGRAS DE ACESSO (RBAC) ---
    
    // 1. ANALISTA REAL: Vê APENAS o que foi atribuído a ele, sem exceção.
    if (currentUser?.role === Role.ANALYST) {
         filteredProcesses = processes.filter(p => p.assignedTo === currentUser.name);
    } 
    // 2. ADMIN OU GERENTE (Supervisão)
    else if (currentUser?.role === Role.ADMIN || currentUser?.role === Role.MANAGER) {
      
      // Se estiver na aba/role de ANALISTA, vê tudo que está distribuído (visão global da equipe)
      if (role === Role.ANALYST) {
         filteredProcesses = processes.filter(p => p.status === ProcessStatus.DISTRIBUTED || p.status === ProcessStatus.COMPLETED);
      } 
      // Se estiver na aba/role de SOLICITANTE, vê os seus próprios pedidos (ou todos se quiser, mantendo simulação pessoal aqui)
      else if (role === Role.REQUESTER) {
         filteredProcesses = processes.filter(p => p.requesterName === currentUser.name);
      }
      // Se estiver na aba/role de GERENTE, vê tudo (Pendente e Distribuído) para gerenciar
      else {
         // Default (Manager View) - vê tudo
      }
    }

    // --- FILTRAGEM (SEARCH & DATE) ---
    if (dashboardSearchTerm) {
      const term = dashboardSearchTerm.toLowerCase();
      filteredProcesses = filteredProcesses.filter(p => {
        // Busca Rasa (Cabeçalho)
        const matchHeader = (p.id || '').toLowerCase().includes(term) || (p.requesterName || '').toLowerCase().includes(term) || (p.protocolNumber || '').toLowerCase().includes(term);
        // Busca Profunda (Itens)
        const matchItems = p.items.some(item => 
          (item.descricao || '').toLowerCase().includes(term) || 
          (item.gmsCode || '').toLowerCase().includes(term)
        );
        return matchHeader || matchItems;
      });
    }

    if (filterStartDate) {
      filteredProcesses = filteredProcesses.filter(p => new Date(p.createdAt) >= new Date(filterStartDate));
    }
    if (filterEndDate) {
      const end = new Date(filterEndDate);
      end.setHours(23, 59, 59); // Fim do dia
      filteredProcesses = filteredProcesses.filter(p => new Date(p.createdAt) <= end);
    }

    const pendingCount = filteredProcesses.filter(p => p.status === ProcessStatus.PENDING).length;
    const distributedCount = filteredProcesses.filter(p => p.status === ProcessStatus.DISTRIBUTED).length;
    const completedCount = filteredProcesses.filter(p => p.status === ProcessStatus.COMPLETED).length;
     
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between"><div><p className="text-sm text-slate-500 font-medium">{role === Role.REQUESTER ? 'Meus Pedidos Pendentes' : 'Novos Pedidos'}</p><h3 className="text-3xl font-bold text-slate-800">{pendingCount}</h3></div><div className="p-3 bg-amber-50 rounded-lg text-amber-500"><Clock size={24} /></div></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between"><div><p className="text-sm text-slate-500 font-medium">{role === Role.REQUESTER ? 'Meus Em Andamento' : 'Em Distribuição'}</p><h3 className="text-3xl font-bold text-slate-800">{distributedCount}</h3></div><div className="p-3 bg-blue-50 rounded-lg text-blue-500"><Users size={24} /></div></div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 flex items-center justify-between"><div><p className="text-sm text-slate-500 font-medium">Finalizados</p><h3 className="text-3xl font-bold text-slate-800">{completedCount}</h3></div><div className="p-3 bg-green-50 rounded-lg text-green-500"><CheckCircle size={24} /></div></div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                  <h3 className="text-lg font-bold text-slate-800">
                      {role === Role.REQUESTER ? 'Meus Pedidos' : role === Role.ANALYST ? 'Minhas Tarefas' : 'Todos os Processos'}
                      {(currentUser?.role === Role.ADMIN || currentUser?.role === Role.MANAGER) && role === Role.ANALYST && <span className="ml-2 text-xs font-normal text-slate-400">(Modo Supervisão)</span>}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">{filteredProcesses.length} registros encontrados.</p>
                </div>
                
                <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                  <div className="flex gap-2">
                    <input type="date" className="border border-slate-200 rounded-lg text-xs px-2 py-2 focus:outline-none" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} title="Data Inicial"/>
                    <input type="date" className="border border-slate-200 rounded-lg text-xs px-2 py-2 focus:outline-none" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} title="Data Final"/>
                  </div>
                  <div className="relative flex-1 md:flex-none">
                    <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
                    <input 
                      type="text" 
                      placeholder="Buscar (ID, Protocolo, Item, GMS)..." 
                      className="pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                      value={dashboardSearchTerm}
                      onChange={e => setDashboardSearchTerm(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={() => handleExportReport(filteredProcesses)}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                    title="Exportar para Excel (CSV)"
                  >
                    <FileDown size={16}/> <span className="hidden md:inline">Baixar Excel</span>
                  </button>
                </div>
            </div>
            {filteredProcesses.length === 0 ? (<div className="p-8 text-center text-slate-400"><Package size={48} className="mx-auto mb-3 opacity-20"/><p>Nenhum processo encontrado para este perfil ou filtro.</p></div>) : (
              <table className="w-full text-left text-sm text-slate-600">
                <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
                    <tr>
                        <th className="px-6 py-4">ID / Protocolo</th>
                        <th className="px-6 py-4">Solicitante</th>
                        <th className="px-6 py-4">Status / Prioridade</th>
                        <th className="px-6 py-4 text-right">Ação</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredProcesses.map(p => {
                      const delayed = isProcessDelayed(p);
                      return (
                        <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4"><div className="flex flex-col"><span className="font-medium text-slate-900 flex items-center gap-2">{p.id} {delayed && (role === Role.MANAGER || role === Role.ADMIN) && (<AlertTriangle size={14} className="text-red-500" />)}</span><span className="text-xs text-slate-500">{p.protocolNumber || '-'}</span></div></td>
                          <td className="px-6 py-4">{p.requesterName}</td>
                          <td className="px-6 py-4">
                              <div className="flex flex-col gap-1">
                                <span className={`w-fit px-2 py-1 rounded text-xs font-medium border ${getStatusColor(p.status)}`}>{p.status}</span>
                                {p.priority && (
                                    <span className={`w-fit px-2 py-0.5 rounded text-[10px] font-bold border flex items-center gap-1 ${getPriorityColor(p.priority)}`}>
                                        {getPriorityIcon(p.priority)} {p.priority}
                                    </span>
                                )}
                              </div>
                              {getCustomStatusBadge(p.customStatusId)}
                          </td>
                          <td className="px-6 py-4 text-right"><button onClick={() => { setSelectedProcess(p); setGeneratedDoc(''); setAiAnalysis(''); setAnalystInput({ memo: p.memoNumber || '' }); if(role === Role.MANAGER) runAnalysis(p); }} className="text-blue-600 hover:text-blue-800 font-medium flex items-center justify-end gap-1">Abrir <ChevronRight size={16} /></button></td>
                        </tr>
                    )})}
                </tbody>
              </table>
            )}
          </div>
      </div>
    );
  };

  // --- 5. TELA DE LOGIN ---
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
        <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-200">
           <div className="flex justify-center mb-6">
             <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600"><Lock size={32} /></div>
           </div>
           <h2 className="text-2xl font-bold text-center text-slate-800 mb-2">Acesso ao Sistema</h2>
           <p className="text-center text-slate-500 mb-8">Gestão de Processos GPAQ</p>
           <form onSubmit={handleLogin} className="space-y-4">
             <div><label className="block text-sm font-bold text-slate-700 mb-1">Usuário</label><input type="text" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={loginUser} onChange={e => setLoginUser(e.target.value)} placeholder="Digite seu usuário..." /></div>
             <div><label className="block text-sm font-bold text-slate-700 mb-1">Senha</label><input type="password" className="w-full border border-slate-300 rounded-lg px-4 py-3 focus:ring-2 focus:ring-blue-500 focus:outline-none" value={loginPass} onChange={e => setLoginPass(e.target.value)} placeholder="Digite sua senha..." /></div>
             {loginError && (<div className="text-red-500 text-sm text-center bg-red-50 p-2 rounded border border-red-100">{loginError}</div>)}
             <button type="submit" className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-lg transition-colors shadow-lg shadow-blue-500/30">Entrar</button>
           </form>
           <div className="mt-6 text-center text-xs text-slate-400"><p>Acesso restrito a servidores autorizados.</p></div>
        </div>
      </div>
    );
  }

  // --- 6. RENDER PRINCIPAL ---
  return (
    <Layout currentRole={role} setRole={handleSecureSetRole} activeTab={activeTab} setActiveTab={setActiveTab} currentUser={currentUser}>
      {activeTab === 'dashboard' && renderDashboard()}
      {activeTab === 'new-request' && renderNewRequestForm()}
      {activeTab === 'reports' && renderReports()}
      {role === Role.ADMIN && renderAdminPanel()}
      {renderProcessModal()}
    </Layout>
  );
};

export default App;