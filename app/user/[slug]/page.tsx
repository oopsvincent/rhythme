import { getFullUser, getUser } from "@/app/actions/auth";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  AlertCircle, 
  Mail, 
  Phone, 
  Calendar, 
  Shield, 
  CheckCircle2, 
  XCircle,
  User,
  Key,
  Globe,
  Clock
} from "lucide-react";
import Link from "next/link";
import * as React from "react";
import { SupabaseUser, UserMetadata, } from "@/types/user"
import { UserIdentity } from "@supabase/supabase-js";

interface UserPageProps {
  params: Promise<{
    slug: string;
  }>;
}

const page = async ({ params }: UserPageProps) => {
  const user = await getFullUser();
  const { slug } = await params;

  if (slug != user?.id) {
    return (
      <div className="flex justify-center flex-col gap-5 items-center w-full min-h-screen p-4">
        <Alert variant="destructive" className="w-full max-w-2xl">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Unknown user Id</AlertTitle>
          <AlertDescription>
            <p>Please check your user id and try again.</p>
            <ul className="list-inside list-disc text-sm mt-2">
              <li>You cannot see other user&lsquo;s id right now</li>
            </ul>
          </AlertDescription>
        </Alert>
        <Link href={"/user"}>
          <Button>Go to your user page</Button>
        </Link>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section */}
        <Card className="border-2">
          <CardContent className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <Avatar className="w-32 h-32 border-4 border-primary/20 shadow-xl">
                <AvatarImage src={user?.user_metadata?.avatar_url || user?.user_metadata?.picture} alt={user?.user_metadata?.full_name || user?.email} />
                <AvatarFallback className="text-4xl bg-primary/10 text-primary">
                  {user?.user_metadata?.full_name ? getInitials(user.user_metadata.full_name) : <User className="w-12 h-12" />}
                </AvatarFallback>
              </Avatar>
              
              <div className="flex-1 text-center md:text-left space-y-3">
                <div>
                  <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                    {user?.user_metadata?.full_name || user?.user_metadata?.name || 'Anonymous User'}
                  </h1>
                  {user?.user_metadata?.preferred_username && (
                    <p className="text-muted-foreground text-lg mt-1">
                      @{user.user_metadata.preferred_username}
                    </p>
                  )}
                </div>
                
                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  {user?.email_confirmed_at && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Email Verified
                    </Badge>
                  )}
                  {user?.phone_confirmed_at && (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Phone Verified
                    </Badge>
                  )}
                  <Badge variant="secondary">
                    {user?.role || 'authenticated'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Contact Information
              </CardTitle>
              <CardDescription>Your primary contact details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="w-4 h-4" />
                  Email Address
                </div>
                <p className="font-medium break-all">{user?.email}</p>
                {user?.new_email && (
                  <p className="text-sm text-muted-foreground">
                    Pending: {user.new_email}
                  </p>
                )}
              </div>
              
              {user?.phone && (
                <>
                  <Separator />
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Phone className="w-4 h-4" />
                      Phone Number
                    </div>
                    <p className="font-medium">{user.phone}</p>
                    {user?.new_phone && (
                      <p className="text-sm text-muted-foreground">
                        Pending: {user.new_phone}
                      </p>
                    )}
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Account Security */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account Security
              </CardTitle>
              <CardDescription>Security and verification status</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Email Verification</span>
                  {user?.email_confirmed_at ? (
                    <Badge variant="default" className="flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      Verified
                    </Badge>
                  ) : (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <XCircle className="w-3 h-3" />
                      Not Verified
                    </Badge>
                  )}
                </div>
                
                {user?.phone && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm">Phone Verification</span>
                    {user?.phone_confirmed_at ? (
                      <Badge variant="default" className="flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <XCircle className="w-3 h-3" />
                        Not Verified
                      </Badge>
                    )}
                  </div>
                )}
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Key className="w-4 h-4" />
                    User ID
                  </div>
                  <p className="font-mono text-xs break-all bg-muted p-2 rounded">{user?.id}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Authentication Providers */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Authentication Providers
              </CardTitle>
              <CardDescription>Connected sign-in methods</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {user?.identities && user.identities.length > 0 ? (
                  user.identities.map((identity: UserIdentity, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="space-y-1">
                        <p className="font-medium capitalize">{identity.provider}</p>
                        <p className="text-xs text-muted-foreground">
                          {identity.identity_data?.email || identity.identity_data?.phone || 'Connected'}
                        </p>
                      </div>
                      <Badge variant="outline" className="capitalize">
                        {identity.provider}
                      </Badge>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-muted-foreground">No providers connected</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Account Timeline */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="w-5 h-5" />
                Account Timeline
              </CardTitle>
              <CardDescription>Important account dates</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                {user?.created_at && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Account Created</p>
                      <p className="font-medium">{formatDate(user.created_at)}</p>
                    </div>
                  </div>
                )}
                
                {user?.updated_at && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Updated</p>
                      <p className="font-medium">{formatDate(user.updated_at)}</p>
                    </div>
                  </div>
                )}
                
                {user?.last_sign_in_at && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Last Sign In</p>
                      <p className="font-medium">{formatDate(user.last_sign_in_at)}</p>
                    </div>
                  </div>
                )}
                
                {user?.email_confirmed_at && (
                  <div className="flex items-start gap-3">
                    <Calendar className="w-4 h-4 mt-1 text-muted-foreground" />
                    <div>
                      <p className="text-sm text-muted-foreground">Email Confirmed</p>
                      <p className="font-medium">{formatDate(user.email_confirmed_at)}</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Metadata */}
        {user?.user_metadata && Object.keys(user.user_metadata).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>Additional Profile Information</CardTitle>
              <CardDescription>Extra metadata associated with your account</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(user.user_metadata).map(([key, value]: [string, string | boolean]) => {
                  if (key === 'avatar_url' || key === 'picture') return null;
                  return (
                    <div key={key} className="space-y-1">
                      <p className="text-sm text-muted-foreground capitalize">
                        {key.replace(/_/g, ' ')}
                      </p>
                      <p className="font-medium break-all">
                        {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                      </p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        )}

        {/* App Metadata (if exists) */}
        {user?.app_metadata && Object.keys(user.app_metadata).length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
              <CardDescription>Application-level metadata</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Object.entries(user.app_metadata).map(([key, value]: [string, string | boolean]) => (
                  <div key={key} className="space-y-1">
                    <p className="text-sm text-muted-foreground capitalize">
                      {key.replace(/_/g, ' ')}
                    </p>
                    <p className="font-medium break-all">
                      {typeof value === 'object' ? JSON.stringify(value) : String(value)}
                    </p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default page;