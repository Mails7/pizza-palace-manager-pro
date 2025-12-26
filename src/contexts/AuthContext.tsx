import { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { toast } from '@/hooks/use-toast';

interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'garcom' | 'cozinha' | 'caixa';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, role: User['role']) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  hasRole: (role: User['role']) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  // Verificar autenticação ao carregar
  useEffect(() => {
    const loadUser = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Erro ao carregar usuário:', error);
        localStorage.removeItem('user');
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      // Simulação de chamada à API
      await new Promise(resolve => setTimeout(resolve, 1000));

      const mockUsers: Array<{ email: string; password: string; user: User }> = [
        {
          email: 'admin@pizzapalace.com',
          password: 'admin123',
          user: {
            id: '1',
            name: 'Admin',
            email: 'admin@pizzapalace.com',
            role: 'admin',
          },
        },
        {
          email: 'test@test.com',
          password: 'test',
          user: {
            id: '2',
            name: 'Test User',
            email: 'test@test.com',
            role: 'admin',
          },
        },
      ];

      const found = mockUsers.find((u) => u.email === email && u.password === password);

      if (found) {
        const mockUser = found.user;
        
        setUser(mockUser);
        localStorage.setItem('user', JSON.stringify(mockUser));
        
        toast({
          title: 'Login realizado com sucesso!',
          description: `Bem-vindo(a), ${mockUser.name}!`,
        });
      } else {
        throw new Error('Credenciais inválidas');
      }
    } catch (error) {
      console.error('Erro no login:', error);
      toast({
        title: 'Erro ao fazer login',
        description: 'Verifique suas credenciais e tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string, role: User['role']) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newUser: User = {
        id: Math.random().toString(36).substr(2, 9),
        name,
        email,
        role,
      };
      
      console.log('Usuário registrado:', { name, email, role });
      
      toast({
        title: 'Conta criada com sucesso!',
        description: 'Faça login para continuar.',
      });

    } catch (error) {
      console.error('Erro no registro:', error);
      toast({
        title: 'Erro ao criar conta',
        description: 'Não foi possível criar sua conta. Tente novamente.',
        variant: 'destructive',
      });
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  const hasRole = (role: User['role']) => {
    return user?.role === role;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        hasRole,
      }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};
