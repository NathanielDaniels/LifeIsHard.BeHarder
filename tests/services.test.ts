import test from 'node:test';
import assert from 'node:assert/strict';

import { getAllServices } from '../lib/services';

test('the runtime service registry contains only WHOOP', () => {
  assert.deepEqual(
    getAllServices().map((service) => service.id),
    ['whoop'],
  );
});
