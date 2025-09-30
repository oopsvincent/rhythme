import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OAuthButtons from "./OAuth-buttons";
import Link from "next/link";

export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <CardHeader className="text-center font-primary">
        <CardTitle className="lg:hidden text-4xl font-bold text-primary">
          Welcome to Rhythmé
        </CardTitle>
    <h2 className="lg:hidden scroll-m-20 border-b pb-2 text-2xl font-semibold tracking-tight first:mt-0">
          Your rhythm of focus, growth, and balance starts here.
    </h2>
        <h6 className="lg:hidden scroll-m-20 text-xl font-semibold tracking-tighter font-sans">
          One account, a simpler path to productivity
        </h6>
        <h6 className="hidden lg:flex justify-center scroll-m-20 text-center text-2xl font-semibold tracking-tighter font-sans">
          Create Your Rhythmé ID
        </h6>

      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          <div className="flex flex-row gap-2">
            <OAuthButtons />
          </div>
          <form>
            <div className="after:border-border relative text-center text-sm after:absolute after:inset-0 after:top-1/2 after:z-0 after:flex after:items-center after:border-t">
              <span className="bg-card text-muted-foreground relative z-10 px-2">
                Or continue with
              </span>
            </div>
            <div className="grid gap-6">
              <div className="grid gap-3">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                />
              </div>
              <div className="grid gap-3">
                <div className="flex items-center">
                  <Label htmlFor="password">Password</Label>
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-4 hover:underline"
                  >
                    Generate a Password
                  </a>
                </div>
                <Input id="password" type="password" required />
              </div>
              <Button type="submit" className="w-full">
                Create
              </Button>
            </div>
            <div className="text-center text-sm">
              Already have an account?{" "}
        <Link
        href={"/signup/intro"}
        className="underline underline-offset-4"
        >
        
          Login
        </Link>
            </div>
          </form>
        </div>
      </CardContent>
      <div className="text-muted-foreground *:[a]:hover:text-primary text-center text-xs text-balance *:[a]:underline *:[a]:underline-offset-4">
        By clicking continue, you agree to our{" "}
        <Link className="underline" href={"/legal/terms"}>Terms of Service</Link> and{" "}
        <Link className="underline" href={"/legal/privacy"}>Privacy Policy</Link>.
      </div>
    </div>
  );
}
