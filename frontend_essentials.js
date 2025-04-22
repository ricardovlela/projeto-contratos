// Este arquivo contém os componentes essenciais do frontend
// Inclui estrutura básica de páginas e componentes

// App.js - Componente principal
const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ContratoProvider>
          <AlertaProvider>
            <SubelementoProvider>
              <Routes>
                <Route path="/login" element={<Login />} />
                <Route element={<ProtectedRoute />}>
                  <Route path="/" element={<Layout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="contratos" element={<Contratos />} />
                    <Route path="contratos/:id" element={<DetalhesContrato />} />
                    <Route path="contratos/novo" element={<NovoContrato />} />
                    <Route path="subelementos/novo/:contratoId" element={<NovoSubelemento />} />
                    <Route path="configuracoes" element={<Configuracoes />} />
                  </Route>
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </SubelementoProvider>
          </AlertaProvider>
        </ContratoProvider>
      </AuthProvider>
    </Router>
  );
};

// Layout.js - Componente de layout principal
const Layout = () => {
  const { user, logout } = useAuth();
  const [open, setOpen] = useState(true);
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setOpen(!open);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Barra superior */}
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1 }}>
            Gerenciamento de Contratos
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user?.nome || 'Usuário'}
            </Typography>
            <IconButton color="inherit" onClick={handleLogout}>
              <LogoutIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Menu lateral */}
      <Drawer
        variant="permanent"
        open={open}
        sx={{
          width: open ? 240 : 64,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: open ? 240 : 64,
            boxSizing: 'border-box',
            transition: (theme) => theme.transitions.create('width', {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: 'hidden',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            <ListItem button component={Link} to="/">
              <ListItemIcon>
                <DashboardIcon />
              </ListItemIcon>
              <ListItemText primary="Dashboard" sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>
            <ListItem button component={Link} to="/contratos">
              <ListItemIcon>
                <DescriptionIcon />
              </ListItemIcon>
              <ListItemText primary="Contratos" sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>
            <ListItem button component={Link} to="/contratos/novo">
              <ListItemIcon>
                <AddIcon />
              </ListItemIcon>
              <ListItemText primary="Novo Contrato" sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>
            <ListItem button component={Link} to="/configuracoes">
              <ListItemIcon>
                <SettingsIcon />
              </ListItemIcon>
              <ListItemText primary="Configurações" sx={{ opacity: open ? 1 : 0 }} />
            </ListItem>
          </List>
        </Box>
      </Drawer>

      {/* Conteúdo principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'auto' }}>
        <Toolbar />
        <Outlet />
      </Box>
    </Box>
  );
};

// Dashboard.js - Página inicial
const Dashboard = () => {
  const { contratos } = useContratos();
  const { alertas } = useAlertas();
  
  // Cálculos para estatísticas
  const totalContratos = contratos.length;
  const contratosAtivos = contratos.filter(c => c.status === 'Ativo').length;
  const valorTotal = contratos.reduce((sum, c) => sum + parseFloat(c.valorContrato || 0), 0);
  const valorMedido = contratos.reduce((sum, c) => sum + parseFloat(c.valorMedido || 0), 0);
  
  // Dados para gráficos
  const statusData = [
    { name: 'Ativos', value: contratosAtivos },
    { name: 'Vencendo', value: contratos.filter(c => c.status === 'Vencendo').length },
    { name: 'Finalizados', value: contratos.filter(c => c.status === 'Finalizado').length },
    { name: 'Suspensos', value: contratos.filter(c => c.status === 'Suspenso').length }
  ];
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      
      {/* Cards de estatísticas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Total de Contratos
              </Typography>
              <Typography variant="h5" component="div">
                {totalContratos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Contratos Ativos
              </Typography>
              <Typography variant="h5" component="div">
                {contratosAtivos}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Valor Total
              </Typography>
              <Typography variant="h5" component="div">
                R$ {valorTotal.toLocaleString('pt-BR')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Typography color="textSecondary" gutterBottom>
                Valor Medido
              </Typography>
              <Typography variant="h5" component="div">
                R$ {valorMedido.toLocaleString('pt-BR')}
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Gráficos */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Status dos Contratos
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={statusData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Valores por Status
              </Typography>
              <Box sx={{ height: 300 }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={[
                      { name: 'Ativos', valor: contratos.filter(c => c.status === 'Ativo').reduce((sum, c) => sum + parseFloat(c.valorContrato || 0), 0) },
                      { name: 'Vencendo', valor: contratos.filter(c => c.status === 'Vencendo').reduce((sum, c) => sum + parseFloat(c.valorContrato || 0), 0) },
                      { name: 'Finalizados', valor: contratos.filter(c => c.status === 'Finalizado').reduce((sum, c) => sum + parseFloat(c.valorContrato || 0), 0) },
                      { name: 'Suspensos', valor: contratos.filter(c => c.status === 'Suspenso').reduce((sum, c) => sum + parseFloat(c.valorContrato || 0), 0) }
                    ]}
                    margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `R$ ${value.toLocaleString('pt-BR')}`} />
                    <Bar dataKey="valor" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      {/* Alertas e Atividades Recentes */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Alertas Pendentes
              </Typography>
              <List>
                {alertas.slice(0, 5).map((alerta) => (
                  <ListItem key={alerta.id} divider>
                    <ListItemIcon>
                      {alerta.tipo === 'reajuste' ? <UpdateIcon color="warning" /> : 
                       alerta.tipo === 'vencimento' ? <EventBusyIcon color="error" /> : 
                       <AssignmentIcon color="info" />}
                    </ListItemIcon>
                    <ListItemText 
                      primary={alerta.mensagem} 
                      secondary={new Date(alerta.data).toLocaleDateString('pt-BR')} 
                    />
                  </ListItem>
                ))}
                {alertas.length === 0 && (
                  <ListItem>
                    <ListItemText primary="Nenhum alerta pendente" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Atividades Recentes
              </Typography>
              <List>
                {contratos.slice(0, 5).map((contrato) => (
                  <ListItem key={contrato.id} divider>
                    <ListItemIcon>
                      <DescriptionIcon />
                    </ListItemIcon>
                    <ListItemText 
                      primary={`Contrato ${contrato.numeroContrato} - ${contrato.contratante}`} 
                      secondary={`Status: ${contrato.status}`} 
                    />
                  </ListItem>
                ))}
                {contratos.length === 0 && (
                  <ListItem>
                    <ListItemText primary="Nenhuma atividade recente" />
                  </ListItem>
                )}
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

// Contratos.js - Lista de contratos
const Contratos = () => {
  const { contratos, loading } = useContratos();
  const [filteredContratos, setFilteredContratos] = useState([]);
  const [filters, setFilters] = useState({
    status: '',
    contratante: '',
    ano: ''
  });
  
  useEffect(() => {
    let result = [...contratos];
    
    if (filters.status) {
      result = result.filter(c => c.status === filters.status);
    }
    
    if (filters.contratante) {
      result = result.filter(c => 
        c.contratante.toLowerCase().includes(filters.contratante.toLowerCase())
      );
    }
    
    if (filters.ano) {
      result = result.filter(c => c.anoContrato === filters.ano);
    }
    
    setFilteredContratos(result);
  }, [contratos, filters]);
  
  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value
    });
  };
  
  const clearFilters = () => {
    setFilters({
      status: '',
      contratante: '',
      ano: ''
    });
  };
  
  // Opções únicas para filtros
  const statusOptions = [...new Set(contratos.map(c => c.status))];
  const contratanteOptions = [...new Set(contratos.map(c => c.contratante))];
  const anoOptions = [...new Set(contratos.map(c => c.anoContrato))];
  
  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>
        Contratos
      </Typography>
      
      {/* Filtros */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Status</InputLabel>
              <Select
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                label="Status"
              >
                <MenuItem value="">Todos</MenuItem>
                {statusOptions.map(status => (
                  <MenuItem key={status} value={status}>{status}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Contratante</InputLabel>
              <Select
                name="contratante"
                value={filters.contratante}
                onChange={handleFilterChange}
                label="Contratante"
              >
                <MenuItem value="">Todos</MenuItem>
                {contratanteOptions.map(contratante => (
                  <MenuItem key={contratante} value={contratante}>{contratante}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <FormControl fullWidth variant="outlined" size="small">
              <InputLabel>Ano</InputLabel>
              <Select
                name="ano"
                value={filters.ano}
                onChange={handleFilterChange}
                label="Ano"
              >
                <MenuItem value="">Todos</MenuItem>
                {anoOptions.map(ano => (
                  <MenuItem key={ano} value={ano}>{ano}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={3}>
            <Button 
              variant="outlined" 
              onClick={clearFilters}
              startIcon={<ClearIcon />}
              fullWidth
            >
              Limpar Filtros
            </Button>
          </Grid>
        </Grid>
      </Paper>
      
      {/* Tabela de Contratos */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Número</TableCell>
                <TableCell>Contratante</TableCell>
                <TableCell>Contratada</TableCell>
                <TableCell>Objeto</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Valor Contrato</TableCell>
                <TableCell>Valor Medido</TableCell>
                <TableCell>Saldo</TableCell>
                <TableCell>Fim Vigência</TableCell>
                <TableCell>Data Reajuste</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredContratos.length > 0 ? (
                filteredContratos.map((contrato) => (
                  <TableRow key={contrato.id}>
                    <TableCell>{contrato.numeroContrato}</TableCell>
                    <TableCell>{contrato.contratante}</TableCell>
                    <TableCell>{contrato.contratada}</TableCell>
                    <TableCell>{contrato.objeto.substring(0, 30)}...</TableCell>
                    <TableCell>
                      <Chip 
                        label={contrato.status} 
                        color={
                          contrato.status === 'Ativo' ? 'success' :
                          contrato.status === 'Vencendo' ? 'warning' :
                          contrato.status === 'Finalizado' ? 'default' :
                          'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>R$ {parseFloat(contrato.valorContrato).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>R$ {parseFloat(contrato.valorMedido).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>R$ {(parseFloat(contrato.valorContrato) - parseFloat(contrato.valorMedido)).toLocaleString('pt-BR')}</TableCell>
                    <TableCell>{new Date(contrato.fimVigencia).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>{new Date(contrato.dataReajuste).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <IconButton 
                        component={Link} 
                        to={`/contratos/${contrato.id}`}
                        size="small"
                        color="primary"
                      >
                        <VisibilityIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center">
                    Nenhum contrato encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

// DetalhesContrato.js - Detalhes do contrato
const DetalhesContrato = () => {
  const { id } = useParams();
  const { getContrato, loading } = useContratos();
  const { subelementos, getSubelementosByContrato, loadingSubelementos } = useSubelementos();
  const navigate = useNavigate();
  
  const [contrato, setContrato] = useState(null);
  
  useEffect(() => {
    const fetchData = async () => {
      const data = await getContrato(id);
      setContrato(data);
      getSubelementosByContrato(id);
    };
    
    fetchData();
  }, [id, getContrato, getSubelementosByContrato]);
  
  if (loading || !contrato) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Contrato {contrato.numeroContrato}
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/contratos')}
        >
          Voltar
        </Button>
      </Box>
      
      {/* Informações do Contrato */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Informações Básicas */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informações Básicas
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Número do Contrato</Typography>
                <Typography variant="body1">{contrato.numeroContrato}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Contratante</Typography>
                <Typography variant="body1">{contrato.contratante}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Contratada</Typography>
                <Typography variant="body1">{contrato.contratada}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">CNPJ Contratada</Typography>
                <Typography variant="body1">{contrato.cnpjContratada}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">UF</Typography>
                <Typography variant="body1">{contrato.uf}</Typography>
              </Grid>
              <Grid item xs={12} sm={6} md={4}>
                <Typography variant="subtitle2">Ano do Contrato</Typography>
                <Typography variant="body1">{contrato.anoContrato}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Localização */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Localização
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Local da Obra</Typography>
                <Typography variant="body1">{contrato.localObra}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">COD UAU</Typography>
                <Typography variant="body1">{contrato.codUau}</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle2">Link Licitação</Typography>
                <Link href={contrato.linkLicitacao} target="_blank" rel="noopener">
                  {contrato.linkLicitacao}
                </Link>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Objeto e Valores */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Objeto e Valores
            </Typography>
            <Box sx={{ mb: 2 }}>
              <Typography variant="subtitle2">Objeto</Typography>
              <Typography variant="body1">{contrato.objeto}</Typography>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Valor do Contrato</Typography>
                <Typography variant="body1">R$ {parseFloat(contrato.valorContrato).toLocaleString('pt-BR')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Valor Medido</Typography>
                <Typography variant="body1">R$ {parseFloat(contrato.valorMedido).toLocaleString('pt-BR')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Saldo Contratual</Typography>
                <Typography variant="body1">R$ {(parseFloat(contrato.valorContrato) - parseFloat(contrato.valorMedido)).toLocaleString('pt-BR')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Responsável</Typography>
                <Typography variant="body1">{contrato.responsavel}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Datas e Prazos */}
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3, height: '100%' }}>
            <Typography variant="h6" gutterBottom>
              Datas e Prazos
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Data Base Reajuste</Typography>
                <Typography variant="body1">{new Date(contrato.dataBaseReajuste).toLocaleDateString('pt-BR')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Data para Reajuste</Typography>
                <Typography variant="body1">{new Date(contrato.dataReajuste).toLocaleDateString('pt-BR')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Status Reajuste</Typography>
                <Chip 
                  label={contrato.statusReajuste} 
                  color={contrato.statusReajuste === 'Em dia' ? 'success' : 'warning'}
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Início Execução</Typography>
                <Typography variant="body1">{new Date(contrato.inicioExecucao).toLocaleDateString('pt-BR')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Fim Execução</Typography>
                <Typography variant="body1">{new Date(contrato.fimExecucao).toLocaleDateString('pt-BR')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Status Execução</Typography>
                <Chip 
                  label={contrato.statusExecucao} 
                  color={
                    contrato.statusExecucao === 'Em andamento' ? 'info' :
                    contrato.statusExecucao === 'Concluído' ? 'success' :
                    'warning'
                  }
                  size="small"
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Fim Vigência</Typography>
                <Typography variant="body1">{new Date(contrato.fimVigencia).toLocaleDateString('pt-BR')}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Status</Typography>
                <Chip 
                  label={contrato.status} 
                  color={
                    contrato.status === 'Ativo' ? 'success' :
                    contrato.status === 'Vencendo' ? 'warning' :
                    contrato.status === 'Finalizado' ? 'default' :
                    'error'
                  }
                  size="small"
                />
              </Grid>
            </Grid>
          </Paper>
        </Grid>
        
        {/* Informações Adicionais */}
        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Informações Adicionais
            </Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Tipo Execução</Typography>
                <Typography variant="body1">{contrato.tipoExecucao}</Typography>
              </Grid>
              <Grid item xs={12} sm={6}>
                <Typography variant="subtitle2">Informações Empreiteiro</Typography>
                <Typography variant="body1">{contrato.infoEmpreiteiro || 'Não informado'}</Typography>
              </Grid>
            </Grid>
          </Paper>
        </Grid>
      </Grid>
      
      {/* Subelementos */}
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Subelementos
        </Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          component={Link}
          to={`/subelementos/novo/${id}`}
        >
          Novo Subelemento
        </Button>
      </Box>
      
      {loadingSubelementos ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Nome</TableCell>
                <TableCell>Tipo</TableCell>
                <TableCell>Data</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Valor</TableCell>
                <TableCell>Arquivo</TableCell>
                <TableCell>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {subelementos.length > 0 ? (
                subelementos.map((subelemento) => (
                  <TableRow key={subelemento.id}>
                    <TableCell>{subelemento.nome}</TableCell>
                    <TableCell>{subelemento.tipo}</TableCell>
                    <TableCell>{new Date(subelemento.data).toLocaleDateString('pt-BR')}</TableCell>
                    <TableCell>
                      <Chip 
                        label={subelemento.status} 
                        color={
                          subelemento.status === 'Aprovado' ? 'success' :
                          subelemento.status === 'Pendente' ? 'warning' :
                          'error'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {subelemento.valor ? `R$ ${parseFloat(subelemento.valor).toLocaleString('pt-BR')}` : '-'}
                    </TableCell>
                    <TableCell>
                      {subelemento.arquivo ? (
                        <IconButton 
                          href={subelemento.arquivo} 
                          target="_blank" 
                          size="small"
                          color="primary"
                        >
                          <DownloadIcon />
                        </IconButton>
                      ) : (
                        '-'
                      )}
                    </TableCell>
                    <TableCell>
                      <IconButton 
                        size="small"
                        color="primary"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton 
                        size="small"
                        color="error"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} align="center">
                    Nenhum subelemento encontrado
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

// NovoContrato.js - Formulário para novo contrato
const NovoContrato = () => {
  const { addContrato, loading } = useContratos();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    numeroContrato: '',
    contratante: '',
    contratada: '',
    cnpjContratada: '',
    uf: '',
    anoContrato: new Date().getFullYear().toString(),
    localObra: '',
    codUau: '',
    linkLicitacao: '',
    objeto: '',
    valorContrato: '',
    responsavel: '',
    dataBaseReajuste: '',
    dataReajuste: '',
    statusReajuste: 'Em dia',
    inicioExecucao: '',
    fimExecucao: '',
    statusExecucao: 'Em andamento',
    fimVigencia: '',
    status: 'Ativo',
    tipoExecucao: '',
    infoEmpreiteiro: ''
  });
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleDateChange = (name) => (date) => {
    setFormData({
      ...formData,
      [name]: date
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.numeroContrato || !formData.contratante || !formData.objeto || !formData.valorContrato) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      await addContrato({
        ...formData,
        valorMedido: '0', // Valor inicial medido é zero
      });
      navigate('/contratos');
    } catch (error) {
      console.error('Erro ao adicionar contrato:', error);
      alert('Erro ao adicionar contrato. Por favor, tente novamente.');
    }
  };
  
  return (
    <Container maxWidth="lg">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Novo Contrato
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate('/contratos')}
        >
          Voltar
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Informações Básicas */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informações Básicas
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Número do Contrato"
                name="numeroContrato"
                value={formData.numeroContrato}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Contratante"
                name="contratante"
                value={formData.contratante}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                required
                fullWidth
                label="Contratada"
                name="contratada"
                value={formData.contratada}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="CNPJ Contratada"
                name="cnpjContratada"
                value={formData.cnpjContratada}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="UF"
                name="uf"
                value={formData.uf}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                fullWidth
                label="Ano do Contrato"
                name="anoContrato"
                value={formData.anoContrato}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Localização */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Localização
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Local da Obra"
                name="localObra"
                value={formData.localObra}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="COD UAU"
                name="codUau"
                value={formData.codUau}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Link Licitação"
                name="linkLicitacao"
                value={formData.linkLicitacao}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Objeto e Valores */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Objeto e Valores
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                multiline
                rows={4}
                label="Objeto"
                name="objeto"
                value={formData.objeto}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Valor do Contrato"
                name="valorContrato"
                type="number"
                value={formData.valorContrato}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Responsável"
                name="responsavel"
                value={formData.responsavel}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Datas e Prazos */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Datas e Prazos
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="Data Base Reajuste"
                value={formData.dataBaseReajuste ? new Date(formData.dataBaseReajuste) : null}
                onChange={handleDateChange('dataBaseReajuste')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="Data para Reajuste"
                value={formData.dataReajuste ? new Date(formData.dataReajuste) : null}
                onChange={handleDateChange('dataReajuste')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status Reajuste</InputLabel>
                <Select
                  name="statusReajuste"
                  value={formData.statusReajuste}
                  onChange={handleChange}
                  label="Status Reajuste"
                >
                  <MenuItem value="Em dia">Em dia</MenuItem>
                  <MenuItem value="Pendente">Pendente</MenuItem>
                  <MenuItem value="Atrasado">Atrasado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="Início Execução"
                value={formData.inicioExecucao ? new Date(formData.inicioExecucao) : null}
                onChange={handleDateChange('inicioExecucao')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="Fim Execução"
                value={formData.fimExecucao ? new Date(formData.fimExecucao) : null}
                onChange={handleDateChange('fimExecucao')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status Execução</InputLabel>
                <Select
                  name="statusExecucao"
                  value={formData.statusExecucao}
                  onChange={handleChange}
                  label="Status Execução"
                >
                  <MenuItem value="Em andamento">Em andamento</MenuItem>
                  <MenuItem value="Concluído">Concluído</MenuItem>
                  <MenuItem value="Atrasado">Atrasado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <DatePicker
                label="Fim Vigência"
                value={formData.fimVigencia ? new Date(formData.fimVigencia) : null}
                onChange={handleDateChange('fimVigencia')}
                renderInput={(params) => <TextField {...params} fullWidth />}
              />
            </Grid>
            <Grid item xs={12} sm={6} md={4}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="Ativo">Ativo</MenuItem>
                  <MenuItem value="Vencendo">Vencendo</MenuItem>
                  <MenuItem value="Finalizado">Finalizado</MenuItem>
                  <MenuItem value="Suspenso">Suspenso</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            {/* Informações Adicionais */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Informações Adicionais
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Tipo Execução"
                name="tipoExecucao"
                value={formData.tipoExecucao}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Informações Empreiteiro"
                name="infoEmpreiteiro"
                value={formData.infoEmpreiteiro}
                onChange={handleChange}
              />
            </Grid>
            
            {/* Botões */}
            <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() => navigate('/contratos')}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                Salvar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

// NovoSubelemento.js - Formulário para novo subelemento
const NovoSubelemento = () => {
  const { contratoId } = useParams();
  const { getContrato } = useContratos();
  const { addSubelemento, loading } = useSubelementos();
  const navigate = useNavigate();
  
  const [contrato, setContrato] = useState(null);
  const [formData, setFormData] = useState({
    nome: '',
    tipo: '',
    data: '',
    status: 'Pendente',
    descricao: '',
    valor: '',
    arquivo: null
  });
  const [filePreview, setFilePreview] = useState(null);
  
  useEffect(() => {
    const fetchContrato = async () => {
      const data = await getContrato(contratoId);
      setContrato(data);
    };
    
    fetchContrato();
  }, [contratoId, getContrato]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  const handleDateChange = (date) => {
    setFormData({
      ...formData,
      data: date
    });
  };
  
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        arquivo: file
      });
      
      // Criar preview do arquivo
      const reader = new FileReader();
      reader.onload = () => {
        setFilePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validação básica
    if (!formData.nome || !formData.tipo || !formData.data) {
      alert('Por favor, preencha todos os campos obrigatórios');
      return;
    }
    
    try {
      const formDataObj = new FormData();
      formDataObj.append('contratoId', contratoId);
      formDataObj.append('nome', formData.nome);
      formDataObj.append('tipo', formData.tipo);
      formDataObj.append('data', formData.data);
      formDataObj.append('status', formData.status);
      formDataObj.append('descricao', formData.descricao);
      formDataObj.append('valor', formData.valor);
      
      if (formData.arquivo) {
        formDataObj.append('arquivo', formData.arquivo);
      }
      
      await addSubelemento(formDataObj);
      navigate(`/contratos/${contratoId}`);
    } catch (error) {
      console.error('Erro ao adicionar subelemento:', error);
      alert('Erro ao adicionar subelemento. Por favor, tente novamente.');
    }
  };
  
  if (!contrato) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
        <CircularProgress />
      </Box>
    );
  }
  
  return (
    <Container maxWidth="md">
      <Box sx={{ mb: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Novo Subelemento
        </Typography>
        <Button
          variant="outlined"
          startIcon={<ArrowBackIcon />}
          onClick={() => navigate(`/contratos/${contratoId}`)}
        >
          Voltar
        </Button>
      </Box>
      
      <Paper sx={{ p: 3 }}>
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">
            Contrato: {contrato.numeroContrato}
          </Typography>
          <Typography variant="subtitle2">
            Contratante: {contrato.contratante}
          </Typography>
        </Box>
        
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <TextField
                required
                fullWidth
                label="Nome do Subelemento"
                name="nome"
                value={formData.nome}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth required>
                <InputLabel>Tipo</InputLabel>
                <Select
                  name="tipo"
                  value={formData.tipo}
                  onChange={handleChange}
                  label="Tipo"
                >
                  <MenuItem value="Medição">Medição</MenuItem>
                  <MenuItem value="Aditivo">Aditivo</MenuItem>
                  <MenuItem value="Supressão">Supressão</MenuItem>
                  <MenuItem value="Documento">Documento</MenuItem>
                  <MenuItem value="Outro">Outro</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={6}>
              <DatePicker
                label="Data"
                value={formData.data ? new Date(formData.data) : null}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} fullWidth required />}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControl fullWidth>
                <InputLabel>Status</InputLabel>
                <Select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  label="Status"
                >
                  <MenuItem value="Pendente">Pendente</MenuItem>
                  <MenuItem value="Aprovado">Aprovado</MenuItem>
                  <MenuItem value="Rejeitado">Rejeitado</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Descrição"
                name="descricao"
                value={formData.descricao}
                onChange={handleChange}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Valor"
                name="valor"
                type="number"
                value={formData.valor}
                onChange={handleChange}
                InputProps={{
                  startAdornment: <InputAdornment position="start">R$</InputAdornment>,
                }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Button
                variant="outlined"
                component="label"
                fullWidth
                startIcon={<UploadIcon />}
                sx={{ height: '56px' }}
              >
                Anexar Arquivo
                <input
                  type="file"
                  hidden
                  onChange={handleFileChange}
                />
              </Button>
            </Grid>
            
            {filePreview && (
              <Grid item xs={12}>
                <Box sx={{ mt: 2, p: 2, border: '1px dashed grey', borderRadius: 1 }}>
                  <Typography variant="subtitle2" gutterBottom>
                    Arquivo selecionado:
                  </Typography>
                  <Typography variant="body2">
                    {formData.arquivo.name} ({(formData.arquivo.size / 1024).toFixed(2)} KB)
                  </Typography>
                </Box>
              </Grid>
            )}
            
            {/* Botões */}
            <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                sx={{ mr: 2 }}
                onClick={() => navigate(`/contratos/${contratoId}`)}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={loading}
                startIcon={loading ? <CircularProgress size={20} /> : <SaveIcon />}
              >
                Salvar
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

// Configuracoes.js - Página de configurações
const Configuracoes = () => {
  const [formData, setFormData] = useState({
    alertaReajuste: true,
    diasAntecedenciaReajuste: 30,
    alertaVencimento: true,
    diasAntecedenciaVencimento: 30,
    alertaMedicao: true,
    diaMedicao: 5,
    enviarEmail: false,
    emailDestinatarios: ''
  });
  
  const handleChange = (e) => {
    const { name, value, checked, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Aqui seria a chamada para a API para salvar as configurações
    alert('Configurações salvas com sucesso!');
  };
  
  return (
    <Container maxWidth="md">
      <Typography variant="h4" gutterBottom>
        Configurações
      </Typography>
      
      <Paper sx={{ p: 3 }}>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            {/* Alertas de Reajuste */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Alertas de Reajuste
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.alertaReajuste}
                    onChange={handleChange}
                    name="alertaReajuste"
                    color="primary"
                  />
                }
                label="Ativar alertas de reajuste"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dias de antecedência"
                name="diasAntecedenciaReajuste"
                type="number"
                value={formData.diasAntecedenciaReajuste}
                onChange={handleChange}
                disabled={!formData.alertaReajuste}
              />
            </Grid>
            
            {/* Alertas de Vencimento */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Alertas de Vencimento
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.alertaVencimento}
                    onChange={handleChange}
                    name="alertaVencimento"
                    color="primary"
                  />
                }
                label="Ativar alertas de vencimento"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dias de antecedência"
                name="diasAntecedenciaVencimento"
                type="number"
                value={formData.diasAntecedenciaVencimento}
                onChange={handleChange}
                disabled={!formData.alertaVencimento}
              />
            </Grid>
            
            {/* Alertas de Medição */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Alertas de Medição
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.alertaMedicao}
                    onChange={handleChange}
                    name="alertaMedicao"
                    color="primary"
                  />
                }
                label="Ativar alertas de medição"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Dia do mês para medição"
                name="diaMedicao"
                type="number"
                value={formData.diaMedicao}
                onChange={handleChange}
                disabled={!formData.alertaMedicao}
                InputProps={{
                  inputProps: { min: 1, max: 31 }
                }}
              />
            </Grid>
            
            {/* Notificações por Email */}
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Notificações por Email
              </Typography>
            </Grid>
            <Grid item xs={12} sm={6}>
              <FormControlLabel
                control={
                  <Switch
                    checked={formData.enviarEmail}
                    onChange={handleChange}
                    name="enviarEmail"
                    color="primary"
                  />
                }
                label="Enviar notificações por email"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Destinatários (separados por vírgula)"
                name="emailDestinatarios"
                value={formData.emailDestinatarios}
                onChange={handleChange}
                disabled={!formData.enviarEmail}
                placeholder="email1@exemplo.com, email2@exemplo.com"
              />
            </Grid>
            
            {/* Botões */}
            <Grid item xs={12} sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="submit"
                variant="contained"
                startIcon={<SaveIcon />}
              >
                Salvar Configurações
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

// NotFound.js - Página 404
const NotFound = () => {
  return (
    <Container maxWidth="md" sx={{ textAlign: 'center', mt: 8 }}>
      <Typography variant="h1" color="primary" sx={{ fontSize: '6rem', fontWeight: 'bold' }}>
        404
      </Typography>
      <Typography variant="h4" gutterBottom>
        Página não encontrada
      </Typography>
      <Typography variant="body1" sx={{ mb: 4 }}>
        A página que você está procurando não existe ou foi movida.
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to="/"
        startIcon={<HomeIcon />}
      >
        Voltar para o Dashboard
      </Button>
    </Container>
  );
};

// Exportações
export {
  App,
  Layout,
  Dashboard,
  Contratos,
  DetalhesContrato,
  NovoContrato,
  NovoSubelemento,
  Configuracoes,
  NotFound
};
