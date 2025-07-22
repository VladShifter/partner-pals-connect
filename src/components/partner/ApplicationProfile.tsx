
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  User,
  Building,
  Globe,
  MapPin,
  Calendar,
  Users,
  DollarSign,
  Target,
  Edit,
  Mail,
  Briefcase
} from 'lucide-react';

interface ApplicationData {
  id: string;
  email: string;
  name: string;
  entity_type: string;
  company_name?: string;
  individual_type?: string;
  industry?: string;
  business_model?: string;
  website_url?: string;
  country?: string;
  experience_years?: number;
  team_size?: number;
  revenue_goals?: number;
  audience_size?: string;
  partner_roles?: string[];
  marketing_channels?: string[];
  partnership_goals?: string[];
  previous_partnerships?: string;
  why_interested?: string;
  social_profiles?: string;
  created_at: string;
  updated_at: string;
}

interface ApplicationProfileProps {
  application: ApplicationData;
  onEdit?: () => void;
}

const ApplicationProfile: React.FC<ApplicationProfileProps> = ({ application, onEdit }) => {
  const [showFullDetails, setShowFullDetails] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="space-y-6">
      {/* Basic Information */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center">
            <User className="w-5 h-5 mr-2 text-blue-600" />
            Basic Information
          </CardTitle>
          {onEdit && (
            <Button variant="outline" size="sm" onClick={onEdit}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Mail className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium">{application.email}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <User className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium">{application.name}</p>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <Briefcase className="w-4 h-4 text-gray-500" />
              <div>
                <p className="text-sm text-gray-600">Entity Type</p>
                <Badge variant="outline">
                  {application.entity_type === 'company' ? 'Company' : 'Individual'}
                </Badge>
              </div>
            </div>

            {application.entity_type === 'company' && application.company_name && (
              <div className="flex items-center space-x-3">
                <Building className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Company Name</p>
                  <p className="font-medium">{application.company_name}</p>
                </div>
              </div>
            )}

            {application.entity_type === 'individual' && application.individual_type && (
              <div className="flex items-center space-x-3">
                <User className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Individual Type</p>
                  <p className="font-medium">{application.individual_type}</p>
                </div>
              </div>
            )}

            {application.country && (
              <div className="flex items-center space-x-3">
                <MapPin className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Country</p>
                  <p className="font-medium">{application.country}</p>
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Business Information */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
            Business Information
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {application.industry && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Industry</p>
                <Badge>{application.industry}</Badge>
              </div>
            )}

            {application.business_model && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Business Model</p>
                <Badge>{application.business_model}</Badge>
              </div>
            )}

            {application.website_url && (
              <div className="md:col-span-2">
                <p className="text-sm text-gray-600 mb-1">Website</p>
                <a 
                  href={application.website_url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline flex items-center"
                >
                  <Globe className="w-4 h-4 mr-1" />
                  {application.website_url}
                </a>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Partnership Details */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Target className="w-5 h-5 mr-2 text-blue-600" />
            Partnership Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {application.partner_roles && application.partner_roles.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Partner Roles</p>
              <div className="flex flex-wrap gap-2">
                {application.partner_roles.map((role, index) => (
                  <Badge key={index} variant="secondary">
                    {role.replace('_', ' ').toUpperCase()}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {application.partnership_goals && application.partnership_goals.length > 0 && (
            <div>
              <p className="text-sm text-gray-600 mb-2">Partnership Goals</p>
              <div className="flex flex-wrap gap-2">
                {application.partnership_goals.map((goal, index) => (
                  <Badge key={index} variant="outline">
                    {goal}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {application.previous_partnerships && (
            <div>
              <p className="text-sm text-gray-600 mb-1">Previous Partnership Experience</p>
              <p className="font-medium">{application.previous_partnerships}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Experience & Scale */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="w-5 h-5 mr-2 text-blue-600" />
            Experience & Scale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {application.experience_years && (
              <div className="flex items-center space-x-3">
                <Calendar className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Experience</p>
                  <p className="font-medium">{application.experience_years} years</p>
                </div>
              </div>
            )}

            {application.team_size && (
              <div className="flex items-center space-x-3">
                <Users className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Team Size</p>
                  <p className="font-medium">{application.team_size} people</p>
                </div>
              </div>
            )}

            {application.revenue_goals && (
              <div className="flex items-center space-x-3">
                <DollarSign className="w-4 h-4 text-gray-500" />
                <div>
                  <p className="text-sm text-gray-600">Revenue Goals</p>
                  <p className="font-medium">${application.revenue_goals.toLocaleString()}/month</p>
                </div>
              </div>
            )}
          </div>

          {application.audience_size && (
            <div className="mt-4">
              <p className="text-sm text-gray-600 mb-1">Target Audience Size</p>
              <p className="font-medium">{application.audience_size}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Marketing Strategy */}
      {application.marketing_channels && application.marketing_channels.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Marketing Strategy</CardTitle>
          </CardHeader>
          <CardContent>
            <div>
              <p className="text-sm text-gray-600 mb-2">Marketing Channels</p>
              <div className="flex flex-wrap gap-2">
                {application.marketing_channels.map((channel, index) => (
                  <Badge key={index} variant="outline">
                    {channel}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Additional Information */}
      {(application.why_interested || application.social_profiles) && (
        <Card>
          <CardHeader>
            <CardTitle>Additional Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {application.why_interested && (
              <div>
                <p className="text-sm text-gray-600 mb-1">About Your Experience</p>
                <p className="text-gray-800">{application.why_interested}</p>
              </div>
            )}

            {application.social_profiles && (
              <div>
                <p className="text-sm text-gray-600 mb-1">Social Profiles & Portfolio</p>
                <p className="text-gray-800 whitespace-pre-line">{application.social_profiles}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Profile Status */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>Profile created: {formatDate(application.created_at)}</span>
            <span>Last updated: {formatDate(application.updated_at)}</span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ApplicationProfile;
