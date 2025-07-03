
export interface NigerianBank {
  code: string;
  name: string;
}

export const nigerianBanks: NigerianBank[] = [
  { code: '044', name: 'Access Bank' },
  { code: '014', name: 'Afribank Nigeria Plc' },
  { code: '050', name: 'Ecobank Nigeria' },
  { code: '070', name: 'Fidelity Bank' },
  { code: '011', name: 'First Bank of Nigeria' },
  { code: '214', name: 'First City Monument Bank' },
  { code: '058', name: 'Guaranty Trust Bank' },
  { code: '030', name: 'Heritage Bank' },
  { code: '301', name: 'Jaiz Bank' },
  { code: '082', name: 'Keystone Bank' },
  { code: '526', name: 'Providus Bank' },
  { code: '076', name: 'Polaris Bank' },
  { code: '221', name: 'Stanbic IBTC Bank' },
  { code: '068', name: 'Standard Chartered Bank' },
  { code: '232', name: 'Sterling Bank' },
  { code: '100', name: 'SunTrust Bank' },
  { code: '032', name: 'Union Bank of Nigeria' },
  { code: '033', name: 'United Bank For Africa' },
  { code: '215', name: 'Unity Bank' },
  { code: '035', name: 'Wema Bank' },
  { code: '057', name: 'Zenith Bank' },
  { code: '304', name: 'Opay' },
  { code: '305', name: 'Kuda Bank' },
  { code: '306', name: 'Moniepoint' },
  { code: '307', name: 'PalmPay' },
];

export const getBankByName = (bankName: string): NigerianBank | undefined => {
  return nigerianBanks.find(bank => 
    bank.name.toLowerCase().includes(bankName.toLowerCase()) ||
    bankName.toLowerCase().includes(bank.name.toLowerCase())
  );
};
