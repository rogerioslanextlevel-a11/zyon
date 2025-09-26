"use client";

import { useState } from "react";
import { Shield, Eye, EyeOff, Mail, User, Lock, ArrowRight, Sparkles, BookOpen, Target, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { cn } from "@/lib/utils";

// Dashboard Component
function Dashboard({ user }: { user: any }) {
  const [currentView, setCurrentView] = useState('dashboard');

  const DiagnosticoView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#5B2EFF] to-[#14D3FF] flex items-center justify-center">
          <Target className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Diagnóstico de Inglês</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Vamos avaliar seu nível atual de inglês com algumas perguntas rápidas
        </p>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Questão 1 de 10</CardTitle>
          <CardDescription>Escolha a alternativa correta:</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="text-lg font-medium">
            What _____ you doing right now?
          </div>
          <div className="space-y-2">
            {['are', 'is', 'am', 'be'].map((option, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full justify-start text-left h-12"
                onClick={() => alert(`Você escolheu: ${option}`)}
              >
                {String.fromCharCode(65 + index)}. {option}
              </Button>
            ))}
          </div>
          <div className="flex justify-between pt-4">
            <Button variant="outline">Anterior</Button>
            <Button className="bg-gradient-to-r from-[#5B2EFF] to-[#14D3FF]">
              Próxima
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const ConversacaoView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <div className="w-20 h-20 mx-auto rounded-full bg-gradient-to-br from-[#14D3FF] to-[#E6C766] flex items-center justify-center">
          <Sparkles className="w-10 h-10 text-white" />
        </div>
        <h2 className="text-2xl font-bold">Conversação com IA</h2>
        <p className="text-muted-foreground max-w-md mx-auto">
          Pratique inglês conversando com nossa IA especializada
        </p>
      </div>

      <Card className="max-w-2xl mx-auto h-96">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#14D3FF] to-[#E6C766]" />
            <span>AI Teacher</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4">
            <p className="text-sm">
              Hello! I'm your AI English teacher. Let's start with a simple conversation. 
              How are you feeling today?
            </p>
          </div>
          <div className="flex space-x-2">
            <Input placeholder="Type your response in English..." className="flex-1" />
            <Button className="bg-gradient-to-r from-[#14D3FF] to-[#E6C766]">
              Send
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const DashboardView = () => (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-3xl font-bold">Bem-vindo, {user.name}!</h1>
        <p className="text-muted-foreground">
          Continue sua jornada de aprendizado de inglês
        </p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => setCurrentView('diagnostico')}
        >
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#5B2EFF] to-[#14D3FF] flex items-center justify-center mb-4">
              <Target className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Diagnóstico</CardTitle>
            <CardDescription>
              Avalie seu nível atual de inglês
            </CardDescription>
          </CardHeader>
        </Card>

        <Card 
          className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105"
          onClick={() => setCurrentView('conversacao')}
        >
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#14D3FF] to-[#E6C766] flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Conversação IA</CardTitle>
            <CardDescription>
              Pratique conversação com nossa IA
            </CardDescription>
          </CardHeader>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 hover:scale-105">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-[#E6C766] to-[#5B2EFF] flex items-center justify-center mb-4">
              <BookOpen className="w-8 h-8 text-white" />
            </div>
            <CardTitle>Lições</CardTitle>
            <CardDescription>
              Acesse suas lições personalizadas
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Seu Progresso</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span>Nível Atual</span>
                <span>Iniciante</span>
              </div>
              <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-gradient-to-r from-[#5B2EFF] to-[#14D3FF] h-2 rounded-full w-1/4"></div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-[#5B2EFF]">0</div>
                <div className="text-sm text-muted-foreground">Lições Completas</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#14D3FF]">0</div>
                <div className="text-sm text-muted-foreground">Dias de Sequência</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-[#E6C766]">0</div>
                <div className="text-sm text-muted-foreground">XP Total</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      {/* Header */}
      <header className="border-b bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#5B2EFF] to-[#14D3FF] flex items-center justify-center">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-[#5B2EFF] to-[#14D3FF] bg-clip-text text-transparent">
              Zion
            </span>
          </div>
          <div className="flex items-center space-x-4">
            <Button
              variant={currentView === 'dashboard' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('dashboard')}
              className={currentView === 'dashboard' ? 'bg-gradient-to-r from-[#5B2EFF] to-[#14D3FF]' : ''}
            >
              Dashboard
            </Button>
            <Button
              variant={currentView === 'diagnostico' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('diagnostico')}
              className={currentView === 'diagnostico' ? 'bg-gradient-to-r from-[#5B2EFF] to-[#14D3FF]' : ''}
            >
              Diagnóstico
            </Button>
            <Button
              variant={currentView === 'conversacao' ? 'default' : 'ghost'}
              onClick={() => setCurrentView('conversacao')}
              className={currentView === 'conversacao' ? 'bg-gradient-to-r from-[#5B2EFF] to-[#14D3FF]' : ''}
            >
              Conversação
            </Button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#5B2EFF] to-[#14D3FF] flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {currentView === 'dashboard' && <DashboardView />}
        {currentView === 'diagnostico' && <DiagnosticoView />}
        {currentView === 'conversacao' && <ConversacaoView />}
      </main>
    </div>
  );
}

// Main App Component
export default function App() {
  const [user, setUser] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(false);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simular criação de conta ou login
    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        name: formData.name || 'Usuário',
        email: formData.email,
        level: 'Iniciante',
        xp: 0,
        streak: 0,
        lessonsCompleted: 0
      };
      setUser(userData);
    }, 2000);
  };

  const handleSocialLogin = (provider: string) => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const userData = {
        name: `Usuário ${provider}`,
        email: `user@${provider.toLowerCase()}.com`,
        level: 'Iniciante',
        xp: 0,
        streak: 0,
        lessonsCompleted: 0
      };
      setUser(userData);
    }, 1500);
  };

  const isFormValid = () => {
    if (isLogin) {
      return formData.email.includes('@') && formData.password.length >= 6;
    }
    return formData.name.length >= 2 &&
           formData.email.includes('@') &&
           formData.password.length >= 6 &&
           formData.password === formData.confirmPassword &&
           acceptTerms;
  };

  // Se usuário está logado, mostrar dashboard
  if (user) {
    return <Dashboard user={user} />;
  }

  const ZionLogo = () => (
    <div className="relative">
      <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#5B2EFF] to-[#14D3FF] flex items-center justify-center shadow-2xl">
        <Shield className="w-8 h-8 text-white" />
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-[#14D3FF] rounded-full animate-pulse" />
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#E6C766] rounded-full animate-pulse" />
      </div>
    </div>
  );

  const ParticleButton = ({ children, onClick, disabled = false, className = "", ...props }: any) => (
    <Button
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "relative overflow-hidden transition-all duration-300 bg-gradient-to-r from-[#5B2EFF] to-[#14D3FF] text-white border-0 shadow-lg hover:shadow-2xl hover:scale-105",
        disabled && "opacity-50 cursor-not-allowed hover:scale-100",
        className
      )}
      {...props}
    >
      <span className="relative z-10 flex items-center">{children}</span>
      {!disabled && (
        <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300">
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-gradient-to-r from-transparent via-white to-transparent animate-pulse" />
        </div>
      )}
    </Button>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-[#5B2EFF]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#14D3FF]/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-[#E6C766]/5 rounded-full blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        <Card className="shadow-2xl border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-6 pb-8">
            <div className="flex justify-center">
              <ZionLogo />
            </div>
            <div className="space-y-2">
              <CardTitle className="text-3xl font-bold bg-gradient-to-r from-[#5B2EFF] to-[#14D3FF] bg-clip-text text-transparent">
                {isLogin ? 'Bem-vindo de volta!' : 'Bem-vindo ao Zion'}
              </CardTitle>
              <CardDescription className="text-lg text-muted-foreground">
                {isLogin ? 'Entre na sua conta para continuar' : 'Crie sua conta e comece sua jornada de aprendizado de inglês'}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Nome - apenas no cadastro */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-sm font-medium">
                    Nome completo
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Digite seu nome completo"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10 h-12 border-2 focus:border-[#5B2EFF] transition-colors"
                      required
                    />
                  </div>
                </div>
              )}

              {/* Email */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-[#5B2EFF] transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Senha */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-sm font-medium">
                  Senha
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Mínimo 6 caracteres"
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 focus:border-[#5B2EFF] transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Confirmar Senha - apenas no cadastro */}
              {!isLogin && (
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword" className="text-sm font-medium">
                    Confirmar senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Digite a senha novamente"
                      value={formData.confirmPassword}
                      onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                      className="pl-10 pr-10 h-12 border-2 focus:border-[#5B2EFF] transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                    <p className="text-sm text-red-500">As senhas não coincidem</p>
                  )}
                </div>
              )}

              {/* Termos - apenas no cadastro */}
              {!isLogin && (
                <div className="flex items-start space-x-3 pt-2">
                  <Checkbox
                    id="terms"
                    checked={acceptTerms}
                    onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                    className="mt-1"
                  />
                  <Label htmlFor="terms" className="text-sm text-muted-foreground leading-relaxed">
                    Eu aceito os{" "}
                    <a href="#" className="text-[#5B2EFF] hover:underline font-medium">
                      Termos de Uso
                    </a>{" "}
                    e a{" "}
                    <a href="#" className="text-[#5B2EFF] hover:underline font-medium">
                      Política de Privacidade
                    </a>
                  </Label>
                </div>
              )}

              {/* Botão de Cadastro/Login */}
              <ParticleButton
                type="submit"
                disabled={!isFormValid() || isLoading}
                className="w-full h-12 text-lg font-semibold mt-6"
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>{isLogin ? 'Entrando...' : 'Criando conta...'}</span>
                  </div>
                ) : (
                  <>
                    <span>{isLogin ? 'Entrar' : 'Criar minha conta'}</span>
                    <ArrowRight className="w-5 h-5 ml-2" />
                  </>
                )}
              </ParticleButton>
            </form>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">ou</span>
              </div>
            </div>

            {/* Login Social */}
            <div className="space-y-3">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => handleSocialLogin('Google')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Continuar com Google
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full h-12 border-2 hover:bg-slate-50 dark:hover:bg-slate-800"
                onClick={() => handleSocialLogin('Facebook')}
                disabled={isLoading}
              >
                <svg className="w-5 h-5 mr-3" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Continuar com Facebook
              </Button>
            </div>

            {/* Toggle Login/Cadastro */}
            <div className="text-center pt-4 border-t">
              <p className="text-sm text-muted-foreground">
                {isLogin ? 'Não tem uma conta?' : 'Já tem uma conta?'}{" "}
                <button
                  type="button"
                  onClick={() => setIsLogin(!isLogin)}
                  className="text-[#5B2EFF] hover:underline font-medium"
                >
                  {isLogin ? 'Criar conta' : 'Fazer login'}
                </button>
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Features Preview - apenas no cadastro */}
        {!isLogin && (
          <div className="mt-8 grid grid-cols-3 gap-4 text-center">
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#5B2EFF]/20 to-[#14D3FF]/20 flex items-center justify-center">
                <Target className="w-6 h-6 text-[#5B2EFF]" />
              </div>
              <p className="text-xs text-muted-foreground">Diagnóstico Inteligente</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#14D3FF]/20 to-[#E6C766]/20 flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-[#14D3FF]" />
              </div>
              <p className="text-xs text-muted-foreground">Conversação com IA</p>
            </div>
            <div className="space-y-2">
              <div className="w-12 h-12 mx-auto rounded-full bg-gradient-to-br from-[#E6C766]/20 to-[#5B2EFF]/20 flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-[#E6C766]" />
              </div>
              <p className="text-xs text-muted-foreground">Lições Personalizadas</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}