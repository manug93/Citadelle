import { users, news, contacts, InsertUser, InsertNews, InsertContact, User, NewsItem, Contact } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

// modify the interface with any CRUD methods
// you might need
export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // News operations
  getAllNews(): Promise<NewsItem[]>;
  getNewsById(id: number): Promise<NewsItem | undefined>;
  createNews(newsItem: InsertNews): Promise<NewsItem>;
  updateNews(id: number, newsItem: InsertNews): Promise<NewsItem | undefined>;
  deleteNews(id: number): Promise<boolean>;
  
  // Contact operations
  getAllContacts(): Promise<Contact[]>;
  getContactById(id: number): Promise<Contact | undefined>;
  createContact(contact: InsertContact): Promise<Contact>;
  markContactAsRead(id: number): Promise<boolean>;
  deleteContact(id: number): Promise<boolean>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private usersMap: Map<number, User>;
  private newsMap: Map<number, NewsItem>;
  private contactsMap: Map<number, Contact>;
  sessionStore: session.SessionStore;
  private userIdCounter: number;
  private newsIdCounter: number;
  private contactIdCounter: number;

  constructor() {
    this.usersMap = new Map();
    this.newsMap = new Map();
    this.contactsMap = new Map();
    this.userIdCounter = 1;
    this.newsIdCounter = 1;
    this.contactIdCounter = 1;
    
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000 // prune expired entries every 24h
    });
    
    // Create admin user with credentials: admin/cit@delle2025byInchtechs
    this.createUser({
      username: "admin",
      email: "admin@lacitadelle.com",
      password: "cit@delle2025byInchtechs", // Will be hashed during user creation
      role: "admin"
    });
    
    // Create some initial news items
    const categories = ["partnership", "achievement", "expansion"];
    const sampleNews = [
      {
        title: "Nouveau partenariat stratégique avec la SIC",
        content: "Le Groupe La Citadelle S.A. annonce la signature d'un accord majeur avec la Société Immobilière du Cameroun pour la construction de 5000 logements sociaux.",
        summary: "Signature d'un accord majeur pour la construction de logements sociaux",
        category: "partnership",
        imageUrl: "https://images.unsplash.com/photo-1531834685032-c34bf0d84c77?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        date: new Date("2023-03-12"),
        author: "La Citadelle S.A."
      },
      {
        title: "Achèvement du tronçon routier Ebolowa-Nkoemvon",
        content: "Après 18 mois de travaux, le Groupe La Citadelle S.A. livre le tronçon routier Ebolowa-Nkoemvon, améliorant significativement la mobilité dans la région Sud.",
        category: "achievement",
        imageUrl: "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        date: new Date("2023-02-28"),
        author: "Équipe Technique"
      },
      {
        title: "Ouverture d'un bureau de représentation au Rwanda",
        content: "Dans le cadre de sa stratégie d'expansion régionale, le Groupe La Citadelle S.A. inaugure un bureau de représentation à Kigali pour coordonner ses activités en Afrique de l'Est.",
        category: "expansion",
        imageUrl: "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=500",
        date: new Date("2023-01-15"),
        author: "Direction Générale"
      }
    ];
    
    sampleNews.forEach(item => {
      this.createNews(item);
    });
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.usersMap.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.username.toLowerCase() === username.toLowerCase()
    );
  }
  
  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.usersMap.values()).find(
      (user) => user.email.toLowerCase() === email.toLowerCase()
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.usersMap.set(id, user);
    return user;
  }
  
  // News methods
  async getAllNews(): Promise<NewsItem[]> {
    return Array.from(this.newsMap.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getNewsById(id: number): Promise<NewsItem | undefined> {
    return this.newsMap.get(id);
  }
  
  async createNews(newsItem: InsertNews): Promise<NewsItem> {
    const id = this.newsIdCounter++;
    const now = new Date();
    const fullNewsItem: NewsItem = { 
      ...newsItem, 
      id, 
      date: newsItem.date ? new Date(newsItem.date) : now
    };
    this.newsMap.set(id, fullNewsItem);
    return fullNewsItem;
  }
  
  async updateNews(id: number, newsItem: InsertNews): Promise<NewsItem | undefined> {
    const existingNews = this.newsMap.get(id);
    if (!existingNews) return undefined;
    
    const updatedNews: NewsItem = { 
      ...existingNews, 
      ...newsItem,
      date: newsItem.date ? new Date(newsItem.date) : existingNews.date,
      id: existingNews.id
    };
    
    this.newsMap.set(id, updatedNews);
    return updatedNews;
  }
  
  async deleteNews(id: number): Promise<boolean> {
    if (!this.newsMap.has(id)) return false;
    return this.newsMap.delete(id);
  }
  
  // Contact methods
  async getAllContacts(): Promise<Contact[]> {
    return Array.from(this.contactsMap.values())
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }
  
  async getContactById(id: number): Promise<Contact | undefined> {
    return this.contactsMap.get(id);
  }
  
  async createContact(contactData: InsertContact): Promise<Contact> {
    const id = this.contactIdCounter++;
    const now = new Date();
    const contact: Contact = { 
      ...contactData, 
      id, 
      date: now,
      isRead: false
    };
    this.contactsMap.set(id, contact);
    return contact;
  }
  
  async markContactAsRead(id: number): Promise<boolean> {
    const contact = this.contactsMap.get(id);
    if (!contact) return false;
    
    contact.isRead = true;
    this.contactsMap.set(id, contact);
    return true;
  }
  
  async deleteContact(id: number): Promise<boolean> {
    if (!this.contactsMap.has(id)) return false;
    return this.contactsMap.delete(id);
  }
}

export const storage = new MemStorage();
