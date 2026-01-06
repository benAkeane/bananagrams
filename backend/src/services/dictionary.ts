import fetch from 'node-fetch';
import * as dotenv from 'dotenv'
dotenv.config();

const API_KEY = process.env.MW_API_KEY!;
const BASE_URL = 'https://www.dictionaryapi.com/api/v3/references/collegiate/json';
const cache = new Map<string, boolean>();

export async function isWordValid(word: string): Promise<boolean> {
    const lower_word = word.toLowerCase(); // make words lowercase since API is case-sensitive

    if (cache.has(lower_word)) {
        return cache.get(lower_word)!;
    }

    const url = `${BASE_URL}/${lower_word}?key=${API_KEY}`;

    try {
        const res = await fetch(url);
        if (!res.ok) {
            return false;
        }

        const data: unknown = await res.json();

        const valid =
            Array.isArray(data) &&
            data.length > 0 &&
            typeof data[0] === 'object' &&
            data[0] !== null;

        cache.set(lower_word, valid);
        return valid;
    } catch (err) {
        console.error('Dictionary API error:', err);
        cache.set(lower_word, false);
        return false;
    }
}

export async function areWordsValid(words: string[]): Promise<boolean> {
    for (const word of words) {
        if (!(await isWordValid(word))) {
            return false;
        }
    }
    return true;
}