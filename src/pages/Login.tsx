import { useState, type FormEvent, type MouseEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Icons } from '@/components/ui/icons';
import { toast } from '@/hooks/use-toast';

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();

  const handleForgotPassword = (e: MouseEvent) => {
    e.preventDefault();
    toast({
      title: 'Em breve',
      description: 'Recuperação de senha ainda não está disponível.',
    });
  };

  const handleRegister = (e: MouseEvent) => {
    e.preventDefault();
    toast({
      title: 'Em breve',
      description: 'Cadastro de usuários ainda não está disponível.',
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Erro',
        description: 'Por favor, preencha todos os campos.',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    try {
      await login(email, password);
      // A navegação será tratada pelo AuthHandler
    } catch (error) {
      // O erro já é tratado no AuthContext
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Pizza Palace Manager</CardTitle>
          <CardDescription className="text-center">
            Faça login para acessar o painel administrativo
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Senha</Label>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="text-sm font-medium text-primary hover:underline"
                  disabled={isLoading}
                >
                  Esqueceu a senha?
                </button>
              </div>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && (
                <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
              )}
              {isLoading ? 'Entrando...' : 'Entrar'}
            </Button>
            <div className="text-center text-sm">
              Não tem uma conta?{' '}
              <button
                type="button"
                onClick={handleRegister}
                className="font-medium text-primary hover:underline"
                disabled={isLoading}
              >
                Cadastre-se
              </button>
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}

export default Login;
