export interface CreateAcademyRequest {
  name: string;
  country: string;
  city: string;
  directorName: string;
  directorEmail: string;
}

export interface Academy {
  id: number;
  name: string;
  city: string;
  country: string;
}

export interface AcademyMember {
  userId: number;
  name: string;
  email: string;
  roles: string[];
}
