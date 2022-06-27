"use strict";

import assert from "assert";
import nock from "nock";
import "dotenv/config";
import { main } from "../../index.js";

const { EMAIL } = process.env;
const url = "https://rooftop-career-switch.herokuapp.com";

describe("Test main function", function () {
  before(() => {
    nock.cleanAll();
  });

  it("test return array", async function () {
    const expectedData = ["f319", "4e3e", "3720", "3341"];
    const token = "123";
    const nockToken = nock(url).get(`/token?email=${EMAIL}`).reply(200, {
      token,
    });

    const data = ["f319", "3720", "4e3e", "3341"];
    const nockData = nock(url).get(`/blocks?token=${token}`).reply(200, {
      data,
    });

    let blocks = ["f319", "3720"];
    const nockCheck1 = nock(url)
      .post(`/check?token=${token}`, { blocks })
      .reply(200, {
        message: false,
      });

    blocks = ["f319", "4e3e"];
    const nockCheck2 = nock(url)
      .post(`/check?token=${token}`, { blocks })
      .reply(200, {
        message: true,
      });

    blocks = ["4e3e", "3720"];
    const nockCheck3 = nock(url)
      .post(`/check?token=${token}`, { blocks })
      .reply(200, {
        message: true,
      });

    const result = await main();

    assert.deepEqual(expectedData, result, "Should be equal");
    assert.equal(nockToken.isDone(), true, "Should be called nockToken");
    assert.equal(nockToken.isDone(), true, "Should be called nockToken");
    assert.equal(nockData.isDone(), true, "Should be called nockData");
    assert.equal(nockCheck1.isDone(), true, "Should be called nockCheck1");
    assert.equal(nockCheck2.isDone(), true, "Should be called nockCheck2");
    assert.equal(nockCheck3.isDone(), true, "Should be called nockCheck3");
  });

  it("test with check error", async function () {
    const token = "123";
    const nockToken = nock(url).get(`/token?email=${EMAIL}`).reply(200, {
      token,
    });

    const data = ["f319", "3720", "4e3e", "3341"];
    const nockData = nock(url).get(`/blocks?token=${token}`).reply(200, {
      data,
    });

    let blocks = ["f319", "3720"];
    const nockCheck1 = nock(url)
      .post(`/check?token=${token}`, { blocks })
      .reply(200, {
        message: false,
      });

    blocks = ["f319", "4e3e"];
    const nockCheck2 = nock(url)
      .post(`/check?token=${token}`, { blocks })
      .reply(200, {
        message: true,
      });

    blocks = ["4e3e", "3720"];
    const nockCheck3 = nock(url)
      .post(`/check?token=${token}`, { blocks })
      .reply(200, {
        message: "Error",
      });

    try {
      await main();
    } catch (error) {
      assert.equal(error.message, "Error with the endpoint check", "Should be equal");
    }

    assert.equal(nockToken.isDone(), true, "Should be called nockToken");
    assert.equal(nockToken.isDone(), true, "Should be called nockToken");
    assert.equal(nockData.isDone(), true, "Should be called nockData");
    assert.equal(nockCheck1.isDone(), true, "Should be called nockCheck1");
    assert.equal(nockCheck2.isDone(), true, "Should be called nockCheck2");
    assert.equal(nockCheck3.isDone(), true, "Should be called nockCheck3");
  });
});
