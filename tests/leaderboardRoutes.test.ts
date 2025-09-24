import request from 'supertest'
import app from '../src/app'
import { leaderboard } from '../src/models/leaderboard';

describe("GET /leaderboard/", () => {
  it("should provide empty array when no scores exist", async () => {
    
    leaderboard.length = 0

    const res = await request(app)
      .get("/leaderboard")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toStrictEqual([]);
  });

});