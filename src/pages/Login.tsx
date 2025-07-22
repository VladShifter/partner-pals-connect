
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isResetMode, setIsResetMode] = useState(false);
  const [isResetLoading, setIsResetLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    console.log('Login attempt for email:', email);
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        console.error('Login error:', error);
        throw error;
      }

      console.log('Login successful, user data:', data.user);

      // Get user profile to determine role and redirect
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single();

      console.log('User profile:', profile);
      if (profileError) {
        console.error('Profile fetch error:', profileError);
      }

      toast({
        title: "Вход выполнен успешно!",
        description: "Добро пожаловать в Rezollo.",
      });

      // Navigate based on user role
      const userRole = profile?.role || 'partner';
      console.log('User role determined:', userRole);
      
      switch (userRole) {
        case 'admin':
          console.log('Redirecting to admin overview');
          navigate("/admin/overview");
          break;
        case 'vendor':
          console.log('Redirecting to vendor dashboard');
          navigate("/vendor/dashboard");
          break;
        case 'partner':
        default:
          console.log('Redirecting to partner dashboard');
          navigate("/partner/dashboard");
      }
    } catch (error: any) {
      console.error('Authentication error details:', error);
      
      let errorMessage = error.message;
      
      if (error.message.includes('Invalid login credentials')) {
        errorMessage = "Неверный email или пароль. Проверьте данные и попробуйте снова, или воспользуйтесь восстановлением пароля.";
      } else if (error.message.includes('Email not confirmed')) {
        errorMessage = "Пожалуйста, подтвердите ваш email перед входом.";
      } else if (error.message.includes('Too many requests')) {
        errorMessage = "Слишком много попыток входа. Попробуйте позже.";
      }
      
      toast({
        title: "Ошибка входа",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast({
        title: "Введите email",
        description: "Пожалуйста, введите ваш email адрес для восстановления пароля.",
        variant: "destructive"
      });
      return;
    }

    setIsResetLoading(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
        redirectTo: `${window.location.origin}/login`,
      });

      if (error) {
        console.error('Password reset error:', error);
        throw error;
      }

      toast({
        title: "Письмо отправлено!",
        description: "Проверьте вашу почту и следуйте инструкциям для восстановления пароля.",
      });
      
      setIsResetMode(false);
    } catch (error: any) {
      console.error('Password reset error details:', error);
      
      let errorMessage = "Не удалось отправить письмо для восстановления пароля.";
      
      if (error.message.includes('User not found')) {
        errorMessage = "Пользователь с таким email не найден.";
      }
      
      toast({
        title: "Ошибка восстановления",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsResetLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <Header />
      
      <div className="flex items-center justify-center min-h-[calc(100vh-4rem)] px-4">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-xl">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold">
                {isResetMode ? "Восстановление пароля" : "Добро пожаловать"}
              </CardTitle>
              <CardDescription>
                {isResetMode 
                  ? "Введите ваш email для восстановления пароля"
                  : "Войдите в ваш аккаунт Rezollo"
                }
              </CardDescription>
            </CardHeader>
            <CardContent>
              {isResetMode ? (
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="reset-email">Email</Label>
                    <Input
                      id="reset-email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isResetLoading}>
                    {isResetLoading ? "Отправка..." : "Отправить ссылку для восстановления"}
                  </Button>
                  
                  <Button 
                    type="button" 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setIsResetMode(false)}
                  >
                    Назад к входу
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@company.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Пароль</Label>
                    <div className="relative">
                      <Input
                        id="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Введите ваш пароль"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      "Вход..."
                    ) : (
                      <>
                        <Mail className="w-4 h-4 mr-2" />
                        Войти
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center">
                    <Button 
                      type="button" 
                      variant="link" 
                      className="text-sm text-blue-600 hover:text-blue-500"
                      onClick={() => setIsResetMode(true)}
                    >
                      Забыли пароль?
                    </Button>
                  </div>
                </form>
              )}
              
              {!isResetMode && (
                <div className="mt-6 text-center text-sm text-gray-600">
                  Нет аккаунта?{" "}
                  <Link to="/signup" className="font-medium text-blue-600 hover:text-blue-500">
                    Зарегистрироваться
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
          
          <div className="mt-6 text-center">
            <Link 
              to="/" 
              className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-4 h-4 mr-1" />
              На главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
