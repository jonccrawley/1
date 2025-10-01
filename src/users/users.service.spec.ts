import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { CacheService } from './cache.service';

describe('UsersService', () => {
  let service: UsersService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService, CacheService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    cacheService = module.get<CacheService>(CacheService);
  });

  afterEach(() => {
    cacheService.clear();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOne', () => {
    it('should return a user by id', () => {
      const user = service.findOne(1);
      expect(user).toBeDefined();
      expect(user.id).toBe(1);
      expect(user.name).toBe('John Doe');
    });

    it('should return undefined for non-existent user', () => {
      const user = service.findOne(999);
      expect(user).toBeUndefined();
    });
  });

  describe('calculateUserScore', () => {
    it('should calculate and cache user score', async () => {
      const result = await service.calculateUserScore(1);
      expect(result.score).toBeDefined();
      expect(result.cached).toBe(false);

      // Second call should return cached value
      const cachedResult = await service.calculateUserScore(1);
      expect(cachedResult.score).toBe(result.score);
      expect(cachedResult.cached).toBe(true);
    });

    it('should throw error for non-existent user', async () => {
      await expect(service.calculateUserScore(999)).rejects.toThrow('User not found');
    });

    it('should handle concurrent requests correctly', async () => {
      // Clear any existing cache
      cacheService.clear();

      let calculationCount = 0;
      const originalComputeScore = service['computeScore'];

      // Spy on the private computeScore method to count calculations
      service['computeScore'] = jest.fn(function(user) {
        calculationCount++;
        return originalComputeScore.call(this, user);
      });

      // Make 5 concurrent requests for the same user
      const promises = Array(5).fill(null).map(() =>
        service.calculateUserScore(1)
      );

      const results = await Promise.all(promises);

      // All results should have the same score
      const firstScore = results[0].score;
      results.forEach(result => {
        expect(result.score).toBe(firstScore);
      });

      // IMPORTANT: Only ONE calculation should have been performed
      // This test will FAIL due to the race condition bug
      expect(calculationCount).toBe(1);

      // Verify that subsequent calls use cache
      const cachedResult = await service.calculateUserScore(1);
      expect(cachedResult.cached).toBe(true);
      expect(calculationCount).toBe(1); // Still only 1 calculation
    });

    it('should apply activity bonuses correctly', async () => {
      const user2Result = await service.calculateUserScore(2);
      // User 2 has 150 points base, no recent activity bonus, no diverse activity bonus
      expect(user2Result.score).toBe(150);
    });
  });

  describe('create', () => {
    it('should create a new user', () => {
      const createUserDto = { name: 'New User', email: 'new@example.com' };
      const user = service.create(createUserDto);

      expect(user.id).toBeDefined();
      expect(user.name).toBe('New User');
      expect(user.email).toBe('new@example.com');
      expect(user.points).toBe(0);
      expect(user.activities).toEqual([]);
    });
  });
});