import { async } from 'regenerator-runtime';
import { TIMEOUT_SEC } from './config.js';
export const timeout = function (s) {
  return new Promise(function (_, rej) {
    setTimeout(() => {
      rej(new Error(`Request took too long! Timeout after ${s} seconds`));
    }, s * 1000);
  });
};
export const AJAX = async function (URL, uploadData = undefined) {
  try {
    const fetchPro = uploadData
      ? fetch(URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(uploadData),
        })
      : fetch(URL);
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} - ${res.status}`);
    return data;
  } catch (err) {}
};
/*
export const getJSON = async function (URL) {
  try {
    const res = await Promise.race([fetch(URL), timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} - ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};
export const sendJSON = async function (URL, uploadData) {
  try {
    const fetchPro = fetch(URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData),
    });
    const res = await Promise.race([fetchPro, timeout(TIMEOUT_SEC)]);
    const data = await res.json();
    if (!res.ok) throw new Error(`${data.message} - ${res.status}`);
    return data;
  } catch (err) {
    throw err;
  }
};
*/
