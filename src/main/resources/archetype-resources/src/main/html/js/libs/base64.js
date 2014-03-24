/*
Copyright (c) 2008 Fred Palmer fred.palmer_at_gmail.com

Permission is hereby granted, free of charge, to any person
obtaining a copy of this software and associated documentation
files (the "Software"), to deal in the Software without
restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the
Software is furnished to do so, subject to the following
conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
OTHER DEALINGS IN THE SOFTWARE.
 */
function StringBuffer() {
	this.buffer = [];
}

StringBuffer.prototype.append = function append(string) {
	this.buffer.push(string);
	return this;
};

StringBuffer.prototype.toString = function toString() {
	return this.buffer.join("");
};

var Base64 = {
	codex : "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",

	encode : function(input) {
		var output = new StringBuffer();

		var enumerator = new Utf8EncodeEnumerator(input);
		while (enumerator.moveNext()) {
			var chr1 = enumerator.current;

			enumerator.moveNext();
			var chr2 = enumerator.current;

			enumerator.moveNext();
			var chr3 = enumerator.current;

			var enc1 = chr1 >> 2;
			var enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
			var enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
			var enc4 = chr3 & 63;

			if (isNaN(chr2)) {
				enc3 = enc4 = 64;
			} else if (isNaN(chr3)) {
				enc4 = 64;
			}

			output.append(this.codex.charAt(enc1) + this.codex.charAt(enc2)
					+ this.codex.charAt(enc3) + this.codex.charAt(enc4));
		}

		return output.toString();
	},

	decodeToHex : function(input) {
		for ( var i = 0, bin = this.decode(input), hex = []; i < bin.length; ++i) {
			var tmp = bin.charCodeAt(i).toString(16);
			if (tmp.length === 1)
				tmp = "0" + tmp;
			hex[hex.length] = tmp;
		}
		return hex.join("");
	},

	decode : function(base64) {
		if (/(=[^=]+|={3,})$/.test(base64))
			throw new Error("String contains an invalid character");
		
		base64 = base64.replace(/=/g, "");
		var n = base64.length & 3;
		if (n === 1)
			throw new Error("String contains an invalid character");
		for ( var i = 0, j = 0, len = base64.length / 4, bin = []; i < len; ++i) {
			var a = this.codex.indexOf(base64[j++] || "A"), 
				b = this.codex.indexOf(base64[j++] || "A");
			var c = this.codex.indexOf(base64[j++] || "A"), 
				d = this.codex.indexOf(base64[j++] || "A");
			if ((a | b | c | d) < 0)
				throw new Error("String contains an invalid character");
			bin[bin.length] = ((a << 2) | (b >> 4)) & 255;
			bin[bin.length] = ((b << 4) | (c >> 2)) & 255;
			bin[bin.length] = ((c << 6) | d) & 255;
		}
		
		return String.fromCharCode.apply(null, bin).substr(0,
				bin.length + n - 4);
	}
};

function Utf8EncodeEnumerator(input) {
	this._input = input;
	this._index = -1;
	this._buffer = [];
}

Utf8EncodeEnumerator.prototype = {
	current : Number.NaN,

	moveNext : function() {
		if (this._buffer.length > 0) {
			this.current = this._buffer.shift();
			return true;
		} else if (this._index >= (this._input.length - 1)) {
			this.current = Number.NaN;
			return false;
		} else {
			var charCode = this._input.charCodeAt(++this._index);

			// "\r\n" -> "\n"
			//
			if ((charCode == 13)
					&& (this._input.charCodeAt(this._index + 1) == 10)) {
				charCode = 10;
				this._index += 2;
			}

			if (charCode < 128) {
				this.current = charCode;
			} else if ((charCode > 127) && (charCode < 2048)) {
				this.current = (charCode >> 6) | 192;
				this._buffer.push((charCode & 63) | 128);
			} else {
				this.current = (charCode >> 12) | 224;
				this._buffer.push(((charCode >> 6) & 63) | 128);
				this._buffer.push((charCode & 63) | 128);
			}

			return true;
		}
	}
}

function Base64DecodeEnumerator(input) {
	this._input = input;
	this._index = -1;
	this._buffer = [];
}

Base64DecodeEnumerator.prototype = {
	current : 64,

	moveNext : function() {
		if (this._buffer.length > 0) {
			this.current = this._buffer.shift();
			return true;
		} else if (this._index >= (this._input.length - 1)) {
			this.current = 64;
			return false;
		} else {
			var enc1 = Base64.codex.indexOf(this._input.charAt(++this._index));
			var enc2 = Base64.codex.indexOf(this._input.charAt(++this._index));
			var enc3 = Base64.codex.indexOf(this._input.charAt(++this._index));
			var enc4 = Base64.codex.indexOf(this._input.charAt(++this._index));

			var chr1 = (enc1 << 2) | (enc2 >> 4);
			var chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
			var chr3 = ((enc3 & 3) << 6) | enc4;

			this.current = chr1;

			if (enc3 != 64)
				this._buffer.push(chr2);

			if (enc4 != 64)
				this._buffer.push(chr3);

			return true;
		}
	}
};
