import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { CacheService } from './cache.service';

interface User {
  id: number;
  name: string;
  email: string;
  points: number;
  activities: Activity[];
}

interface Activity {
  type: 'purchase' | 'review' | 'referral';
  points: number;
  timestamp: Date;
}

@Injectable()
export class UsersService {
  private users: User[] = [
    {
      id: 1,
      name: 'John Doe',
      email: 'john@example.com',
      points: 100,
      activities: [
        { type: 'purchase', points: 50, timestamp: new Date('2024-01-01') },
        { type: 'review', points: 30, timestamp: new Date('2024-01-15') },
        { type: 'referral', points: 20, timestamp: new Date('2024-02-01') },
      ],
    },
    {
      id: 2,
      name: 'Jane Smith',
      email: 'jane@example.com',
      points: 150,
      activities: [
        { type: 'purchase', points: 100, timestamp: new Date('2024-01-10') },
        { type: 'review', points: 50, timestamp: new Date('2024-01-20') },
      ],
    },
  ];

  constructor(private cacheService: CacheService) {}

  create(createUserDto: CreateUserDto) {
    const newUser: User = {
      id: this.users.length + 1,
      ...createUserDto,
      points: 0,
      activities: [],
    };
    this.users.push(newUser);
    return newUser;
  }

  findAll() {
    return this.users;
  }

  findOne(id: number) {
    return this.users.find(user => user.id === id);
  }

  async calculateUserScore(userId: number): Promise<{ score: number; cached: boolean }> {
    const cacheKey = `user-score-${userId}`;

    // Check cache first
    let cachedScore = await this.cacheService.get(cacheKey);
    if (cachedScore !== null) {
      return { score: cachedScore, cached: true };
    }

    const user = this.findOne(userId);
    if (!user) {
      throw new Error('User not found');
    }

    // Simulate expensive calculation with delay
    await this.simulateExpensiveOperation();

    // BUG: Race condition - multiple simultaneous requests will all calculate and overwrite cache
    const score = this.computeScore(user);

    // Set cache after calculation
    await this.cacheService.set(cacheKey, score);

    return { score, cached: false };
  }

  private computeScore(user: User): number {
    let score = user.points;

    // Apply bonuses based on activity patterns
    const recentActivities = user.activities.filter(
      a => a.timestamp > new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    );

    if (recentActivities.length >= 3) {
      score *= 1.5; // 50% bonus for active users
    }

    const hasAllTypes = ['purchase', 'review', 'referral'].every(
      type => user.activities.some(a => a.type === type)
    );

    if (hasAllTypes) {
      score *= 1.2; // 20% bonus for diverse activities
    }

    return Math.round(score);
  }

  private async simulateExpensiveOperation(): Promise<void> {
    // Simulate a database query or complex calculation
    return new Promise(resolve => setTimeout(resolve, 1000));
  }
}