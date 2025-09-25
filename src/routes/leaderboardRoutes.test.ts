import request from 'supertest'
import app from '../app'
import * as db from '../db/mysql';
import { QueryResult } from 'mysql2/promise';

describe("GET /leaderboard/", () => {
  it("should provide empty array when no scores exist", async () => {
    const get_all_data_mock = new Promise<QueryResult>((resolve, reject) => {
        resolve([])
    });
    const mock = jest.spyOn(db, 'get_all_data');
    mock.mockReturnValue(get_all_data_mock);

    const res = await request(app)
      .get("/leaderboard")
      .expect("Content-Type", /json/)
      .expect(200);

    expect(res.body).toStrictEqual([]);
  });

  it("should raise an error when get_all_data errors", async () => {
    const get_all_data_mock = new Promise<QueryResult>((resolve, reject) => {
        reject("Database failed")
    });
    const mock = jest.spyOn(db, 'get_all_data');
    mock.mockReturnValue(get_all_data_mock);

    const res = await request(app)
      .get("/leaderboard")
      .expect("Content-Type", /json/)
      .expect(500);
  });

});