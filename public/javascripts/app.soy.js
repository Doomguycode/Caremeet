// This file was automatically generated from app.soy.
// Please don't edit this file by hand.

/**
 * @fileoverview Templates in namespace com.poovarasan.application.
 */

if (typeof com == 'undefined') { var com = {}; }
if (typeof com.poovarasan == 'undefined') { com.poovarasan = {}; }
if (typeof com.poovarasan.application == 'undefined') { com.poovarasan.application = {}; }


com.poovarasan.application.page = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.header == null || (opt_data.header instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.header), "expected param 'header' of type null|string|undefined.");
  var header = /** @type {null|string|undefined} */ (opt_data.header);
  return '' + aui.page.document({windowTitle: '', headContent: '<link rel="stylesheet" href="/static/css/aui.min.css" /><link rel="stylesheet" href="/static/css/aui-experimental.css" /><link rel="stylesheet" href="/static/css/aui-iconfonts.min.css" />', content: aui.page.page({headerContent: '' + soy.$$escapeHtml(header), contentContent: '<!-- call aui.page.pagePanel here -->', footerContent: '<!-- literal content here -->'}) + '<script src="/static/js/jq.js"><\/script><script src="/static/js/aui.min.js"><\/script><script src="/static/js/aui-datepicker.min.js"><\/script><script src="/static/js/aui-soy.min.js"><\/script><script src="/static/js/soyutils.js"><\/script><script src="/static/js/soy.js"><\/script>'});
};
if (goog.DEBUG) {
  com.poovarasan.application.page.soyTemplateName = 'com.poovarasan.application.page';
}


com.poovarasan.application.boxPattern = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.image == null || (opt_data.image instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.image), "expected param 'image' of type null|string|undefined.");
  var image = /** @type {null|string|undefined} */ (opt_data.image);
  goog.asserts.assert(opt_data.heading == null || (opt_data.heading instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.heading), "expected param 'heading' of type null|string|undefined.");
  var heading = /** @type {null|string|undefined} */ (opt_data.heading);
  goog.asserts.assert(opt_data.description == null || (opt_data.description instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.description), "expected param 'description' of type null|string|undefined.");
  var description = /** @type {null|string|undefined} */ (opt_data.description);
  goog.asserts.assert(opt_data.secondaryDescription == null || (opt_data.secondaryDescription instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.secondaryDescription), "expected param 'secondaryDescription' of type null|string|undefined.");
  var secondaryDescription = /** @type {null|string|undefined} */ (opt_data.secondaryDescription);
  return '<div class="col-3 card"><div class="col-3"><img class="img-responsive" src="' + soy.$$escapeHtml(image) + '"></div><div class="col-9"><h2>' + soy.$$escapeHtml(heading) + '</h2><p>' + soy.$$escapeHtml(description) + '</p>' + ((secondaryDescription) ? soy.$$filterNoAutoescape(secondaryDescription) : '') + '</div></div>';
};
if (goog.DEBUG) {
  com.poovarasan.application.boxPattern.soyTemplateName = 'com.poovarasan.application.boxPattern';
}


com.poovarasan.application.cboxPattern = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.image == null || (opt_data.image instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.image), "expected param 'image' of type null|string|undefined.");
  var image = /** @type {null|string|undefined} */ (opt_data.image);
  goog.asserts.assert(opt_data.heading == null || (opt_data.heading instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.heading), "expected param 'heading' of type null|string|undefined.");
  var heading = /** @type {null|string|undefined} */ (opt_data.heading);
  goog.asserts.assert(opt_data.description == null || (opt_data.description instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.description), "expected param 'description' of type null|string|undefined.");
  var description = /** @type {null|string|undefined} */ (opt_data.description);
  goog.asserts.assert(opt_data.secondaryDescription == null || (opt_data.secondaryDescription instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.secondaryDescription), "expected param 'secondaryDescription' of type null|string|undefined.");
  var secondaryDescription = /** @type {null|string|undefined} */ (opt_data.secondaryDescription);
  return '<div class="aui-help aui-help-empty-state"><div class="aui-help-illustration"><img height="128" width="128" src="' + soy.$$escapeHtml(image) + '" /></div><div class="aui-help-content"><h6>' + soy.$$escapeHtml(heading) + '</h6><p>' + soy.$$escapeHtml(description) + '</p>' + ((secondaryDescription) ? soy.$$filterNoAutoescape(secondaryDescription) : '') + '</div></div>';
};
if (goog.DEBUG) {
  com.poovarasan.application.cboxPattern.soyTemplateName = 'com.poovarasan.application.cboxPattern';
}


com.poovarasan.application.normalHeader = function(opt_data, opt_ignored) {
  return '' + aui.page.header({logo: 'bitbucket', headerLink: '#'});
};
if (goog.DEBUG) {
  com.poovarasan.application.normalHeader.soyTemplateName = 'com.poovarasan.application.normalHeader';
}


com.poovarasan.application.appHeader = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.isLoggedIn == null || goog.isBoolean(opt_data.isLoggedIn), "expected param 'isLoggedIn' of type boolean|null|undefined.");
  var isLoggedIn = /** @type {boolean|null|undefined} */ (opt_data.isLoggedIn);
  return '' + aui.page.header({logo: 'bitbucket', headerLink: '#', primaryNavContent: '<ul class="aui-nav"></ul>', secondaryNavContent: '<ul class="aui-nav"><li><form class="aui-quicksearch" method="post" action="/foo"><label class="assistive" for="quicksearchid">Search</label><input type="search" name="quicksearchname" placeholder="Quick Search" class="search search-input" id="quicksearchid"></form></li>' + ((isLoggedIn) ? '<h1>loggedom</h1>' : '<li><a href="/auth" class="aui-button aui-button-primary">Sign In</a></li><li><a href="https://example.com/" class="aui-button">Register</a></li>') + '</ul>'});
};
if (goog.DEBUG) {
  com.poovarasan.application.appHeader.soyTemplateName = 'com.poovarasan.application.appHeader';
}


com.poovarasan.application.availableUsers = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.stream == null || (opt_data.stream instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.stream), "expected param 'stream' of type null|string|undefined.");
  var stream = /** @type {null|string|undefined} */ (opt_data.stream);
  goog.asserts.assert(opt_data.title == null || (opt_data.title instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.title), "expected param 'title' of type null|string|undefined.");
  var title = /** @type {null|string|undefined} */ (opt_data.title);
  return '' + ((stream) ? '<span class="aui-avatar aui-avatar-project aui-avatar-xxxlarge"><span class="aui-avatar-inner"><img src="/images/avatar.png?title=' + soy.$$escapeHtml(title) + '" alt="" role="presentation" /</span></span>' : '<span class="aui-avatar aui-avatar-project aui-avatar-xxxlarge"><span class="aui-avatar-inner"><img src="/images/avatar.png" alt="" role="presentation" /</span></span>');
};
if (goog.DEBUG) {
  com.poovarasan.application.availableUsers.soyTemplateName = 'com.poovarasan.application.availableUsers';
}


com.poovarasan.application.onlineUsers = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.stream == null || (opt_data.stream instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.stream), "expected param 'stream' of type null|string|undefined.");
  var stream = /** @type {null|string|undefined} */ (opt_data.stream);
  goog.asserts.assert(opt_data.title == null || (opt_data.title instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.title), "expected param 'title' of type null|string|undefined.");
  var title = /** @type {null|string|undefined} */ (opt_data.title);
  goog.asserts.assert(opt_data.userid == null || (opt_data.userid instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.userid), "expected param 'userid' of type null|string|undefined.");
  var userid = /** @type {null|string|undefined} */ (opt_data.userid);
  goog.asserts.assert(opt_data.presenter == null || goog.isBoolean(opt_data.presenter), "expected param 'presenter' of type boolean|null|undefined.");
  var presenter = /** @type {boolean|null|undefined} */ (opt_data.presenter);
  return '<li><a class="aui-nav-item stat-tooltip" href="#" title="' + soy.$$escapeHtml(title) + '" id="' + soy.$$escapeHtml(userid) + '"><span class="aui-icon aui-icon-small aui-iconfont-user"></span><span class="aui-nav-item-label">' + soy.$$escapeHtml(title) + '<span style="float:right;"><i id="' + soy.$$escapeHtml(userid) + '_speaker" stream="' + soy.$$escapeHtml(stream) + '" style="margin-top:2px;display:none;" class="muser-icon fas fa-volume-up"></i><i id="' + soy.$$escapeHtml(userid) + '_mute" stream="' + soy.$$escapeHtml(stream) + '" style="margin-top:2px;display:none;" class="muser-icon fas fa-microphone-slash"></i>' + ((presenter) ? '<i id="' + soy.$$escapeHtml(userid) + '_presenter" stream="' + soy.$$escapeHtml(stream) + '" style="margin-top:2px;" class="muser-icon fas fa-carrot"></i>' : '') + '</span></span></a></li>';
};
if (goog.DEBUG) {
  com.poovarasan.application.onlineUsers.soyTemplateName = 'com.poovarasan.application.onlineUsers';
}


com.poovarasan.application.addStream = function(opt_data, opt_ignored) {
  opt_data = opt_data || {};
  goog.asserts.assert(opt_data.streamUrl == null || opt_data.streamUrl != null, "expected param 'streamUrl' of type *|null|undefined.");
  var streamUrl = /** @type {*|null|undefined} */ (opt_data.streamUrl);
  goog.asserts.assert(opt_data.title == null || (opt_data.title instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.title), "expected param 'title' of type null|string|undefined.");
  var title = /** @type {null|string|undefined} */ (opt_data.title);
  goog.asserts.assert(opt_data.userid == null || (opt_data.userid instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.userid), "expected param 'userid' of type null|string|undefined.");
  var userid = /** @type {null|string|undefined} */ (opt_data.userid);
  goog.asserts.assert(opt_data.cssClass == null || (opt_data.cssClass instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.cssClass), "expected param 'cssClass' of type null|string|undefined.");
  var cssClass = /** @type {null|string|undefined} */ (opt_data.cssClass);
  goog.asserts.assert(opt_data.streamid == null || (opt_data.streamid instanceof goog.soy.data.SanitizedContent) || goog.isString(opt_data.streamid), "expected param 'streamid' of type null|string|undefined.");
  var streamid = /** @type {null|string|undefined} */ (opt_data.streamid);
  return '<div id=\'' + soy.$$escapeHtml(userid) + '_stream\'><h6>' + soy.$$escapeHtml(title) + '</h6><video  id="' + soy.$$escapeHtml(streamid) + '" width="320" class="' + soy.$$escapeHtml(cssClass) + '" src="' + soy.$$escapeHtml(streamUrl) + '" autoplay="true" playsinline="true"></video></div>';
};
if (goog.DEBUG) {
  com.poovarasan.application.addStream.soyTemplateName = 'com.poovarasan.application.addStream';
}
