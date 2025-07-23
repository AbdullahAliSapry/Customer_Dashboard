

import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Ban, CreditCard, FileText, MapPin, UserCheck } from 'lucide-react';
import { ProfileTab } from '../components/profile/ProfileTab';
import { ProfileSection } from '../components/profile/ProfileSection';
import { useSelector } from 'react-redux';
import { RootState } from '../Store/Store';

interface Tab {
  id: string;
  label: string;
  icon: React.ReactNode;
  content: React.ReactNode;
}

const ProfilePage = () => {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState('personal');
  const customerData = useSelector((state: RootState) => state.customer.customerData);

  // Helper function to format dates
  const formatDate = (dateString: string | Date) => {
    if (!dateString) return t('profile.not_available');
    const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
    return date.toLocaleDateString();
  };

  // Map nationality codes to names (example mapping)
  const getNationalityName = (code: number) => {
    const nationalities: Record<number, string> = {
      0: t('profile.nationalities.saudi'),
      1: t('profile.nationalities.uae'),
      2: t('profile.nationalities.kuwait'),
      // Add more as needed
    };
    return nationalities[code] || t('profile.nationalities.unknown');
  };

  // Map document types to names (example mapping)
  const getDocumentTypeName = (code: number) => {
    const documentTypes: Record<number, string> = {
      0: t('profile.document_types.commercial_registration'),
      1: t('profile.document_types.freelancer_license'),
      2: t('profile.document_types.resident_permit'),
      // Add more as needed
    };
    return documentTypes[code] || t('profile.document_types.unknown');
  };

  // Handle field updates
  const handleFieldUpdate = (fieldKey: string, newValue: string) => {
    console.log(`Updating field ${fieldKey} with value: ${newValue}`);
    // Here you would typically dispatch an action to update the Redux store
    // For now, we'll just log the update
    // dispatch(updateCustomerField({ fieldKey, value: newValue }));
  };

  const getPersonalFields = () => {
    if (!customerData || !customerData.user) return [];
    
    return [
      { label: t('profile.full_name'), value: customerData.user.fullName, fieldKey: 'user.fullName' },
      { label: t('profile.email'), value: customerData.user.email, fieldKey: 'user.email' },
      { label: t('profile.phone_number'), value: customerData.user.phoneNumber, fieldKey: 'user.phoneNumber' },
      { label: t('profile.location'), value: customerData.location, fieldKey: 'location' },
      { label: t('profile.nationality'), value: getNationalityName(customerData.nationality), fieldKey: 'nationality' },
      { label: t('profile.document_type'), value: getDocumentTypeName(customerData.documentType), fieldKey: 'documentType' },
      { label: t('profile.national_address'), value: customerData.nationalAddress, fieldKey: 'nationalAddress' },
      { label: t('profile.birth_date'), value: formatDate(customerData.birthDate), fieldKey: 'birthDate' },
      { label: t('profile.id_issue_date'), value: formatDate(customerData.idIssueDate), fieldKey: 'idIssueDate' },
      { label: t('profile.id_expiry_date'), value: formatDate(customerData.idExpiryDate), fieldKey: 'idExpiryDate' },
      { label: t('profile.freelancer'), value: customerData.isFreelancer ? t('profile.yes') : t('profile.no'), fieldKey: 'isFreelancer' },
      ...(customerData.imageIdentity 
        ? [{ label: t('profile.id_image'), value: '', isImage: true, imageUrl: customerData.imageIdentity.url }]
        : [])
    ];
  };

  const getNationalAddressFields = () => {
    if (!customerData) return [];
    
    return [
      { label: t('profile.national_address'), value: customerData.nationalAddress, fieldKey: 'nationalAddress' },
      ...(customerData.imageNationalAddress
        ? [{ label: t('profile.image_national_address'), value: '', isImage: true, imageUrl: customerData.imageNationalAddress.url }]
        : [])
    ];
  };

  const getFreelancerFields = () => {
    if (!customerData || !customerData.freelancerLicense) return [];
    
    return [
      { label: t('profile.identity_number'), value: customerData.freelancerLicense.numberIdentity, fieldKey: 'freelancerLicense.numberIdentity' },
      { label: t('profile.license_number'), value: customerData.freelancerLicense.licenseNumber, fieldKey: 'freelancerLicense.licenseNumber' },
      { label: t('profile.licensed_activity'), value: customerData.freelancerLicense.licensedActivity, fieldKey: 'freelancerLicense.licensedActivity' },
      { label: t('profile.issue_date'), value: formatDate(customerData.freelancerLicense.issueDate), fieldKey: 'freelancerLicense.issueDate' },
      { label: t('profile.expiry_date'), value: formatDate(customerData.freelancerLicense.expiryDate), fieldKey: 'freelancerLicense.expiryDate' },
      ...(customerData.freelancerLicense.documentCom
        ? [{ label: t('profile.license_document'), value: '', isImage: true, imageUrl: customerData.freelancerLicense.documentCom.url }]
        : [])
    ];
  };

  const getBankFields = () => {
    if (!customerData || !customerData.bankAccount) return [];
    
    return [
      { label: t('profile.business_name'), value: customerData.bankAccount.businessName, fieldKey: 'bankAccount.businessName' },
      { label: t('profile.account_number'), value: customerData.bankAccount.accountNumber, fieldKey: 'bankAccount.accountNumber' },
      { label: t('profile.iban'), value: customerData.bankAccount.iban, fieldKey: 'bankAccount.iban' },
      { label: t('profile.swift_code'), value: customerData.bankAccount.swiftCode, fieldKey: 'bankAccount.swiftCode' },
      { label: t('profile.country'), value: customerData.bankAccount.country, fieldKey: 'bankAccount.country' },
      { label: t('profile.bank_name'), value: customerData.bankAccount.bankName, fieldKey: 'bankAccount.bankName' },
      ...(customerData.bankAccount.bankCertificateCom
        ? [{ label: t('profile.bank_certificate'), value: '', isImage: true, imageUrl: customerData.bankAccount.bankCertificateCom.url }]
        : [])
    ];
  };

  const getTaxFields = () => {
    if (!customerData || !customerData.taxDetails) return [];
    
    return [
      { label: t('profile.has_tax_declaration'), value: customerData.taxDetails.hasTaxDeclaration ? t('profile.yes') : t('profile.no'), fieldKey: 'taxDetails.hasTaxDeclaration' },
      { label: t('profile.tax_number'), value: customerData.taxDetails.taxNumber || t('profile.not_available'), fieldKey: 'taxDetails.taxNumber' },
      ...(customerData.taxDetails.reasonDocument 
        ? [{ label: t('profile.exemption_reason_document'), value: '', isImage: true, imageUrl: customerData.taxDetails.reasonDocument.url }]
        : [])
    ];
  };

  const tabs: Tab[] = [
    {
      id: 'personal',
      label: t('profile.personal_information'),
      icon: <UserCheck size={20} className="text-primary-600" />,
      content: <ProfileSection fields={getPersonalFields()} onFieldUpdate={handleFieldUpdate} />,
    },
    {
      id: 'national',
      label: t('profile.national_address'),
      icon: <MapPin size={20} className="text-primary-600" />,
      content: <ProfileSection fields={getNationalAddressFields()} onFieldUpdate={handleFieldUpdate} />,
    },
    {
      id: 'freelancer',
      label: t('profile.freelancer_information'),
      icon: <CreditCard size={20} className="text-primary-600" />,
      content: <ProfileSection fields={getFreelancerFields()} onFieldUpdate={handleFieldUpdate} />,
    },
    {
      id: 'bank',
      label: t('profile.bank_information'),
      icon: <Ban size={20} className="text-primary-600" />,
      content: <ProfileSection fields={getBankFields()} onFieldUpdate={handleFieldUpdate} />,
    },
    {
      id: 'tax',
      label: t('profile.tax_information'),
      icon: <FileText size={20} className="text-primary-600" />,
      content: <ProfileSection fields={getTaxFields()} onFieldUpdate={handleFieldUpdate} />,
    },
  ];

  return (
    <div className="bg-gray-50 min-h-screen p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8">{t('profile.profile')}</h2>
        
        {/* Tabs Navigation */}
        <div className="bg-white rounded-xl shadow-sm mb-8 overflow-hidden">
          <div className="flex flex-wrap bg-gray-50">
            {tabs.map((tab) => (
              <ProfileTab
                key={tab.id}
                id={tab.id}
                label={tab.label}
                icon={tab.icon}
                isActive={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
              />
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="bg-white rounded-xl shadow-sm p-8">
          {tabs.find((tab) => tab.id === activeTab)?.content}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;