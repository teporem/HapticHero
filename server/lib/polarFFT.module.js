/*
 * Copyright (C) 2006-2020  Music Technology Group - Universitat Pompeu Fabra
 *
 * This file is part of Essentia
 *
 * Essentia is free software: you can redistribute it and/or modify it under
 * the terms of the GNU Affero General Public License as published by the Free
 * Software Foundation (FSF), either version 3 of the License, or (at your
 * option) any later version.
 *
 * This program is distributed in the hope that it will be useful, but WITHOUT
 * ANY WARRANTY; without even the implied warranty of MERCHANTABILITY or FITNESS
 * FOR A PARTICULAR PURPOSE.  See the GNU General Public License for more
 * details.
 *
 * You should have received a copy of the Affero GNU General Public License
 * version 3 along with this program.  If not, see http://www.gnu.org/licenses/
 */
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

Module['vectorToArray'] = function(vect) {
  if (!vect) { throw "Null input"};
  if (vect.size() == 0) { throw "Empty vector input"};
  const typedArray = new Float32Array(vect.size());
    for (var i=0; i < vect.size(); i++) {
      typedArray[i] = vect.get(i); 
      // typedArray[i] = parseFloat(typedArray[i].toFixed(2));
    }
  return typedArray;
}
// EXPORT_ES6 option does not work as described at
// https://github.com/emscripten-core/emscripten/issues/6284, so we have to
// manually add this to the final builds.
export { Module as PolarFFTWASM };