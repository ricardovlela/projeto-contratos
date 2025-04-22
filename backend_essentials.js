// Este arquivo contém os modelos essenciais do backend
// Inclui definições de tabelas e relações do banco de dados

// Modelo de Usuário
const Usuario = (sequelize, DataTypes) => {
  const Usuario = sequelize.define('Usuario', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    senha: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ativo: {
      type: DataTypes.BOOLEAN,
      defaultValue: true
    },
    ultimoLogin: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
    tableName: 'usuarios',
    timestamps: true
  });

  return Usuario;
};

// Modelo de Contrato
const Contrato = (sequelize, DataTypes) => {
  const Contrato = sequelize.define('Contrato', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    numeroContrato: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contratante: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contratada: {
      type: DataTypes.STRING,
      allowNull: false
    },
    cnpjContratada: {
      type: DataTypes.STRING,
      allowNull: true
    },
    uf: {
      type: DataTypes.STRING,
      allowNull: true
    },
    anoContrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    localObra: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codUau: {
      type: DataTypes.STRING,
      allowNull: true
    },
    linkLicitacao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    objeto: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    valorContrato: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    valorMedido: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: false,
      defaultValue: 0
    },
    responsavel: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dataBaseReajuste: {
      type: DataTypes.DATE,
      allowNull: true
    },
    dataReajuste: {
      type: DataTypes.DATE,
      allowNull: true
    },
    statusReajuste: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Em dia'
    },
    inicioExecucao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fimExecucao: {
      type: DataTypes.DATE,
      allowNull: true
    },
    statusExecucao: {
      type: DataTypes.STRING,
      allowNull: true,
      defaultValue: 'Em andamento'
    },
    fimVigencia: {
      type: DataTypes.DATE,
      allowNull: true
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Ativo'
    },
    tipoExecucao: {
      type: DataTypes.STRING,
      allowNull: true
    },
    infoEmpreiteiro: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'contratos',
    timestamps: true
  });

  Contrato.associate = (models) => {
    Contrato.hasMany(models.Subelemento, {
      foreignKey: 'contratoId',
      as: 'subelementos',
      onDelete: 'CASCADE'
    });
  };

  return Contrato;
};

// Modelo de Subelemento
const Subelemento = (sequelize, DataTypes) => {
  const Subelemento = sequelize.define('Subelemento', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contratoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'contratos',
        key: 'id'
      }
    },
    nome: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: 'Pendente'
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    valor: {
      type: DataTypes.DECIMAL(15, 2),
      allowNull: true
    },
    arquivo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    prazoExecucao: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    prazoVigencia: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'subelementos',
    timestamps: true,
    hooks: {
      afterCreate: async (subelemento, options) => {
        // Atualizar valor medido do contrato quando um subelemento do tipo 'Medição' é criado
        if (subelemento.tipo === 'Medição' && subelemento.valor) {
          const Contrato = sequelize.models.Contrato;
          const contrato = await Contrato.findByPk(subelemento.contratoId);
          
          if (contrato) {
            let valorMedido = parseFloat(contrato.valorMedido) || 0;
            valorMedido += parseFloat(subelemento.valor);
            
            await contrato.update({ valorMedido }, { transaction: options.transaction });
          }
        }
        
        // Atualizar valor do contrato quando um subelemento do tipo 'Aditivo' ou 'Supressão' é criado
        if ((subelemento.tipo === 'Aditivo' || subelemento.tipo === 'Supressão') && subelemento.valor) {
          const Contrato = sequelize.models.Contrato;
          const contrato = await Contrato.findByPk(subelemento.contratoId);
          
          if (contrato) {
            let valorContrato = parseFloat(contrato.valorContrato) || 0;
            
            if (subelemento.tipo === 'Aditivo') {
              valorContrato += parseFloat(subelemento.valor);
            } else if (subelemento.tipo === 'Supressão') {
              valorContrato -= parseFloat(subelemento.valor);
            }
            
            await contrato.update({ valorContrato }, { transaction: options.transaction });
          }
        }
      }
    }
  });

  Subelemento.associate = (models) => {
    Subelemento.belongsTo(models.Contrato, {
      foreignKey: 'contratoId',
      as: 'contrato'
    });
  };

  return Subelemento;
};

// Modelo de Alerta
const Alerta = (sequelize, DataTypes) => {
  const Alerta = sequelize.define('Alerta', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    contratoId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'contratos',
        key: 'id'
      }
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    mensagem: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    data: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW
    },
    lido: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    dataLeitura: {
      type: DataTypes.DATE,
      allowNull: true
    },
    usuarioId: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'usuarios',
        key: 'id'
      }
    }
  }, {
    tableName: 'alertas',
    timestamps: true
  });

  Alerta.associate = (models) => {
    Alerta.belongsTo(models.Contrato, {
      foreignKey: 'contratoId',
      as: 'contrato'
    });
    
    Alerta.belongsTo(models.Usuario, {
      foreignKey: 'usuarioId',
      as: 'usuario'
    });
  };

  return Alerta;
};

// Modelo de Configuração
const Configuracao = (sequelize, DataTypes) => {
  const Configuracao = sequelize.define('Configuracao', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    chave: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    valor: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    descricao: {
      type: DataTypes.TEXT,
      allowNull: true
    }
  }, {
    tableName: 'configuracoes',
    timestamps: true
  });

  return Configuracao;
};

// Exportações
module.exports = {
  Usuario,
  Contrato,
  Subelemento,
  Alerta,
  Configuracao
};
