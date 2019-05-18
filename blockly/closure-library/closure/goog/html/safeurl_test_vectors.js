// Copyright 2017 The Closure Library Authors. All Rights Reserved.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS-IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// AUTOGENERATED. DO NOT EDIT.
// clang-format off

goog.provide('goog.html.safeUrlTestVectors');
goog.setTestOnly('goog.html.safeUrlTestVectors');

goog.html.safeUrlTestVectors.BASE_VECTORS = [
      {input: '', expected: '', safe: true},
      {input: 'http://example.com/', expected: 'http://example.com/', safe: true},
      {input: 'https://example.com', expected: 'https://example.com', safe: true},
      {input: 'mailto:foo@example.com', expected: 'mailto:foo@example.com', safe: true},
      {input: 'ftp://example.com', expected: 'ftp://example.com', safe: true},
      {input: 'ftp://username@example.com', expected: 'ftp://username@example.com', safe: true},
      {input: 'ftp://username:password@example.com', expected: 'ftp://username:password@example.com', safe: true},
      {input: 'HTtp://example.com/', expected: 'HTtp://example.com/', safe: true},
      {input: 'https://example.com/path?foo=bar#baz', expected: 'https://example.com/path?foo=bar#baz', safe: true},
      {input: 'https://example.com:123/path?foo=bar&abc=def#baz', expected: 'https://example.com:123/path?foo=bar&abc=def#baz', safe: true},
      {input: '//example.com/path', expected: '//example.com/path', safe: true},
      {input: '/path', expected: '/path', safe: true},
      {input: '/path?foo=bar#baz', expected: '/path?foo=bar#baz', safe: true},
      {input: 'path', expected: 'path', safe: true},
      {input: 'path?foo=bar#baz', expected: 'path?foo=bar#baz', safe: true},
      {input: 'p//ath', expected: 'p//ath', safe: true},
      {input: 'p//ath?foo=bar#baz', expected: 'p//ath?foo=bar#baz', safe: true},
      {input: '#baz', expected: '#baz', safe: true},
      {input: '?:', expected: '?:', safe: true},
      {input: 'javascript:evil();', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'javascript:evil();//\u000Ahttp://good.com/', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:blah', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'not-data:image/png;base64,z=', expected: 'about:invalid#zClosurez', safe: false},
      {input: ' data:image/png;base64,z=', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:image/png;base64,z= ', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:image/;base64,z=', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:ximage/png', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:ximage/png;base64,z=', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:image/pngx;base64,z=', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:audio/whatever;base64,z=', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:audio/;base64,z=', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:video/whatever;base64,z=', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:video/;base64,z=', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:image/png;base64,', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:image/png;base64,abc=!', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:image/png;base64,$$', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:image/png;base64,\u0000', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:video/mp4;baze64,z=', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:video/mp4;,z=', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:text/html,sdfsdfsdfsfsdfs;base64,anything', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'data:image/svg+xml;base64,abc', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'tel:+1234567890', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'sms:+1234567890', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'callto:+1234567890', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'wtai://wp/mc;+1234567890', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'rtsp://example.org/', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'market://details?id=app', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'geo:37.7,42.0', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'skype:chat?jid=foo', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'whatsapp://send?text=Hello', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'ssh://cloud.google.com', expected: 'about:invalid#zClosurez', safe: false},
      {input: ':', expected: 'about:invalid#zClosurez', safe: false},
      {input: '\\:', expected: 'about:invalid#zClosurez', safe: false},
      {input: ':/:', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'path\u000A:', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'java\u0000script:evil();', expected: 'about:invalid#zClosurez', safe: false},
      {input: 'http://www.f\u0000\u0000.com', expected: 'http://www.f\u0000\u0000.com', safe: true},
      {input: 'data:image/png;base64,abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=', expected: 'data:image/png;base64,abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789+/=', safe: true},
      {input: 'dATa:iMage/pNg;bASe64,abc===', expected: 'dATa:iMage/pNg;bASe64,abc===', safe: true},
      {input: 'data:image/webp;base64,abc===', expected: 'data:image/webp;base64,abc===', safe: true},
      {input: 'data:audio/ogg;base64,abc', expected: 'data:audio/ogg;base64,abc', safe: true},
      {input: 'data:audio/L16;base64,abc', expected: 'data:audio/L16;base64,abc', safe: true},
      {input: 'data:video/mpeg;base64,abc', expected: 'data:video/mpeg;base64,abc', safe: true},
      {input: 'data:video/ogg;base64,z=', expected: 'data:video/ogg;base64,z=', safe: true},
      {input: 'data:video/mp4;base64,z=', expected: 'data:video/mp4;base64,z=', safe: true},
      {input: 'data:video/webm;base64,z=', expected: 'data:video/webm;base64,z=', safe: true}
];

goog.html.safeUrlTestVectors.TEL_VECTORS = [
    {input: 'tEl:+1(23)129-29192A.ABC#;eXt=29', expected: 'tEl:+1(23)129-29192A.ABC#;eXt=29', safe: true},
    {input: 'tEL:123;randmomparam=123', expected: 'tEL:123;randmomparam=123', safe: true},
    {input: ':', expected: 'about:invalid#zClosurez', safe: false},
    {input: 'tell:', expected: 'about:invalid#zClosurez', safe: false},
    {input: 'not-tel:+1', expected: 'about:invalid#zClosurez', safe: false},
    {input: ' tel:+1', expected: 'about:invalid#zClosurez', safe: false},
    {input: 'javascript:evil()', expected: 'about:invalid#zClosurez', safe: false},
    {input: 'tel:+1234567890', expected: 'tel:+1234567890', safe: true}
];

goog.html.safeUrlTestVectors.SMS_VECTORS = [
    {input: 'sms:+1234567890', expected: 'sms:+1234567890', safe: true},
    {input: 'sms:?body=message', expected: 'sms:?body=message', safe: true},
    {input: 'sms:?body=Hello, World!', expected: 'about:invalid#zClosurez', safe: false},
    {input: 'sms:?body=a&body=b', expected: 'about:invalid#zClosurez', safe: false}
];

goog.html.safeUrlTestVectors.SSH_VECTORS = [
    {input: 'ssh://cloud.google.com', expected: 'ssh://cloud.google.com', safe: true},
    {input: '', expected: 'about:invalid#zClosurez', safe: false},
    {input: ':', expected: 'about:invalid#zClosurez', safe: false},
    {input: 'ssh:cloud.google.com', expected: 'about:invalid#zClosurez', safe: false},
    {input: ' ssh://cloud.google.com', expected: 'about:invalid#zClosurez', safe: false},
    {input: 'javascript:evil()', expected: 'about:invalid#zClosurez', safe: false}
];
