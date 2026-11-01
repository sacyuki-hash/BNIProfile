export interface WebsiteLink {
  text: string;
  url: string;
}

export interface MemberInfo {
  name: string;
  furigana: string;
  romaji: string;
  category: string;
  categoryEn: string;
  role: string;
  joinedDate: string;
}

export interface BusinessInfo {
  company: string;
  title: string;
  phone: string;
  postalCode: string;
  address: string;
  email: string;
  website?: WebsiteLink;
  facebook?: WebsiteLink;
  otherLinks: WebsiteLink[];
}

export interface KeyValuePair {
  label: string;
  value: string;
}

export interface MRSection {
  business: KeyValuePair[];
  family: KeyValuePair[];
  others: KeyValuePair[];
}

export interface GainsSection {
  goal: string;
  accomplishments: string;
  interests: string;
  networks: string;
  skills: string;
  skillTags: string[];
}

export interface OneToOneItem {
  number: string;
  question: string;
  answer: string;
}

export interface ContactCircleItem {
  index: number;
  name: string;
}

export interface ContactCircleSection {
  top3: string;
  list: ContactCircleItem[];
}

export interface CustomerListSection {
  recentCustomers: ContactCircleItem[];
  aboutCustomers: KeyValuePair[];
  aboutReferrals: KeyValuePair[];
}

export interface ParsedProfile {
  id: string;
  sourceUrl: string;
  fetchedAt: string;
  pageTitle: string;
  photoUrl?: string;
  meishiOmoteUrl?: string;
  meishiUraUrl?: string;
  memberInfo: MemberInfo;
  businessInfo: BusinessInfo;
  mr: MRSection;
  gains: GainsSection;
  oneToOne: OneToOneItem[];
  contactCircle: ContactCircleSection;
  customerList: CustomerListSection;
}
