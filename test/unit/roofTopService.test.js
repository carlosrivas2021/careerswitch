"use strict";

import assert from "assert";
import nock from "nock";
import "dotenv/config";
import roofTopService from "../../services/RoofTopService.js";

const { EMAIL } = process.env;
const url = "https://rooftop-career-switch.herokuapp.com";

describe("Test RoofTopService", function () {
  before(() => {
    nock.cleanAll();
  });

  describe("#getToken()", function () {
    it("test return token from endpoint", async function () {
      const expectedToken = "MDc6TGljZW5zZTEz";
      const nockToken = nock(url).get(`/token?email=${EMAIL}`).reply(200, {
        token: expectedToken,
      });

      const token = await roofTopService.getToken();

      assert.equal(expectedToken, token, "Should be equal");
      assert.equal(nockToken.isDone(), true, "Should be called nockToken");
    });

    it("test return token from endpoint with error", async function () {
      const nockToken = nock(url).get(`/token?email=${EMAIL}`).reply(404, {
        message: "Error",
      });

      try {
        await roofTopService.getToken();
      } catch (error) {
        assert.equal(error.message, "Error with the endpoint token", "Should be equal");
      }

      assert.equal(nockToken.isDone(), true, "Should be called nockToken");
    });
  });

  describe("#getBlocks(token)", function () {
    it("test return block from endpoint", async function () {
      const expectedData = [
        "f319",
        "3720",
        "4e3e",
        "46ec",
        "c7df",
        "c1c7",
        "80fd",
        "c4ea",
      ];
      const token = "123";
      const nockData = nock(url).get(`/blocks?token=${token}`).reply(200, {
        data: expectedData,
      });

      const data = await roofTopService.getBlocks(token);

      assert.deepEqual(expectedData, data, "Should be equal");
      assert.equal(nockData.isDone(), true, "Should be called nockData");
    });

    it("test return block from endpoint with error", async function () {
      const nockData = nock(url).get(`/blocks?token=undefined`).reply(403, {
        message: "Missing token",
      });

      try {
        await roofTopService.getBlocks();
      } catch (error) {
        assert.equal(
          error.message,
          "Error with the endpoint blocks",
          "Should be equal"
        );
      }

      assert.equal(nockData.isDone(), true, "Should be called nockData");
    });
  });

  describe("#check(blocks, token)", function () {
    it("test return block from endpoint", async function () {
      const blocks = ["f319", "3720"];
      const token = "123";
      const nockCheck = nock(url).post(`/check?token=${token}`).reply(200, {
        message: true,
      });

      const message = await roofTopService.check(blocks, token);

      assert.equal(true, message, "Should be equal");
      assert.equal(nockCheck.isDone(), true, "Should be called nockCheck");
    });

    it("test return block from endpoint with error", async function () {
      const nockCheck = nock(url).post(`/check?token=undefined`).reply(403, {
        message: "Missing token",
      });

      try {
        const blocks = ["f319", "3720"];
        await roofTopService.check(blocks);
      } catch (error) {
        assert.equal(error.message, "Error with the endpoint check", "Should be equal");
      }
      assert.equal(nockCheck.isDone(), true, "Should be called nockCheck");
    });
  });
});
