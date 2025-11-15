'use client'
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { Logo } from "@/app/components/logo";
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { useAuth } from "@/firebase";
import { createUserWithEmailAndPassword, updateProfile, signInWithRedirect, GoogleAuthProvider, getRedirectResult } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { GoogleIcon } from "@/app/components/google-icon";

export default function SignupPage() {
  const router = useRouter();
  const auth = useAuth();
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(true); // Start loading to check for redirect

  useEffect(() => {
    if (!auth) return;
    
    const handleRedirectResult = async () => {
      try {
        const result = await getRedirectResult(auth);
        if (result) {
          // User has successfully signed in via redirect.
          // The onAuthStateChanged listener will handle the redirect to '/'
        } else {
          // No redirect result, so the user is just viewing the signup page.
          setGoogleLoading(false);
        }
      } catch (error: any) {
        toast({
          variant: "destructive",
          title: "Google Sign-Up Failed",
          description: error.message,
        });
        setGoogleLoading(false);
      }
    };
    
    handleRedirectResult();
  }, [auth, router, toast]);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth) return;
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      if (userCredential.user) {
        await updateProfile(userCredential.user, {
          displayName: name
        });
      }
      router.push('/');
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Signup Failed",
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleSignIn = async () => {
    if (!auth) return;
    setGoogleLoading(true);
    const provider = new GoogleAuthProvider();
    await signInWithRedirect(auth, provider);
  };

  if (googleLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <p>Signing in...</p>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-sm border-2 border-border">
      <CardHeader className="text-center">
        <div className="mb-4 flex justify-center">
          <Logo />
        </div>
        <CardTitle className="font-headline text-2xl">Create an Account</CardTitle>
        <CardDescription>Enter your information to create an account.</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" type="text" placeholder="John Doe" required value={name} onChange={(e) => setName(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.targe.value)} />
          </div>
          <Button type="submit" className="w-full" disabled={loading || googleLoading}>
            {loading ? 'Signing up...' : 'Sign Up'}
          </Button>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>

        <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={loading || googleLoading}>
          <>
            <GoogleIcon className="mr-2 h-4 w-4" />
            Google
          </>
        </Button>

        <div className="mt-4 text-center text-sm">
          Already have an account?{" "}
          <Link href="/login" className="underline text-primary hover:text-primary/80">
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
