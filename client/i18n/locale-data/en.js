/**
 *
 * Created by zephyre on 10/20/15.
 */


ReactIntl.__addLocaleData({
  "locale": "en",
  "pluralRuleFunction": function (n, ord) {
    var s = String(n).split("."), v0 = !s[1], t0 = Number(s[0]) == n, n10 = t0 && s[0].slice(-1), n100 = t0 && s[0].slice(-2);
    if (ord)return n10 == 1 && n100 != 11 ? "one" : n10 == 2 && n100 != 12 ? "two" : n10 == 3 && n100 != 13 ? "few" : "other";
    return n == 1 && v0 ? "one" : "other"
  },
  "fields": {
    "year": {
      "displayName": "Year",
      "relative": {"0": "this year", "1": "next year", "-1": "last year"},
      "relativeTime": {
        "future": {"one": "in {0} year", "other": "in {0} years"},
        "past": {"one": "{0} year ago", "other": "{0} years ago"}
      }
    },
    "month": {
      "displayName": "Month",
      "relative": {"0": "this month", "1": "next month", "-1": "last month"},
      "relativeTime": {
        "future": {"one": "in {0} month", "other": "in {0} months"},
        "past": {"one": "{0} month ago", "other": "{0} months ago"}
      }
    },
    "day": {
      "displayName": "Day",
      "relative": {"0": "today", "1": "tomorrow", "-1": "yesterday"},
      "relativeTime": {
        "future": {"one": "in {0} day", "other": "in {0} days"},
        "past": {"one": "{0} day ago", "other": "{0} days ago"}
      }
    },
    "hour": {
      "displayName": "Hour",
      "relativeTime": {
        "future": {"one": "in {0} hour", "other": "in {0} hours"},
        "past": {"one": "{0} hour ago", "other": "{0} hours ago"}
      }
    },
    "minute": {
      "displayName": "Minute",
      "relativeTime": {
        "future": {"one": "in {0} minute", "other": "in {0} minutes"},
        "past": {"one": "{0} minute ago", "other": "{0} minutes ago"}
      }
    },
    "second": {
      "displayName": "Second",
      "relative": {"0": "now"},
      "relativeTime": {
        "future": {"one": "in {0} second", "other": "in {0} seconds"},
        "past": {"one": "{0} second ago", "other": "{0} seconds ago"}
      }
    }
  }
});
ReactIntl.__addLocaleData({"locale": "en-001", "parentLocale": "en"});
ReactIntl.__addLocaleData({"locale": "en-150", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-GB", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-AG", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-AI", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-AS", "parentLocale": "en"});
ReactIntl.__addLocaleData({
  "locale": "en-AU",
  "parentLocale": "en-GB",
  "fields": {
    "year": {
      "displayName": "Year",
      "relative": {"0": "This year", "1": "Next year", "-1": "Last year"},
      "relativeTime": {
        "future": {"one": "in {0} year", "other": "in {0} years"},
        "past": {"one": "{0} year ago", "other": "{0} years ago"}
      }
    },
    "month": {
      "displayName": "Month",
      "relative": {"0": "This month", "1": "Next month", "-1": "Last month"},
      "relativeTime": {
        "future": {"one": "in {0} month", "other": "in {0} months"},
        "past": {"one": "{0} month ago", "other": "{0} months ago"}
      }
    },
    "day": {
      "displayName": "Day",
      "relative": {"0": "today", "1": "tomorrow", "-1": "yesterday"},
      "relativeTime": {
        "future": {"one": "in {0} day", "other": "in {0} days"},
        "past": {"one": "{0} day ago", "other": "{0} days ago"}
      }
    },
    "hour": {
      "displayName": "Hour",
      "relativeTime": {
        "future": {"one": "in {0} hour", "other": "in {0} hours"},
        "past": {"one": "{0} hour ago", "other": "{0} hours ago"}
      }
    },
    "minute": {
      "displayName": "Minute",
      "relativeTime": {
        "future": {"one": "in {0} minute", "other": "in {0} minutes"},
        "past": {"one": "{0} minute ago", "other": "{0} minutes ago"}
      }
    },
    "second": {
      "displayName": "Second",
      "relative": {"0": "now"},
      "relativeTime": {
        "future": {"one": "in {0} second", "other": "in {0} seconds"},
        "past": {"one": "{0} second ago", "other": "{0} seconds ago"}
      }
    }
  }
});
ReactIntl.__addLocaleData({"locale": "en-BB", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-BE", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-BM", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-BS", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-BW", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-BZ", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-CA", "parentLocale": "en"});
ReactIntl.__addLocaleData({"locale": "en-CC", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-CK", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-CM", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-CX", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-DG", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-DM", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({
  "locale": "en-Dsrt",
  "pluralRuleFunction": function (n, ord) {
    if (ord)return "other";
    return "other"
  },
  "fields": {
    "year": {
      "displayName": "Year",
      "relative": {"0": "this year", "1": "next year", "-1": "last year"},
      "relativeTime": {"future": {"other": "+{0} y"}, "past": {"other": "-{0} y"}}
    },
    "month": {
      "displayName": "Month",
      "relative": {"0": "this month", "1": "next month", "-1": "last month"},
      "relativeTime": {"future": {"other": "+{0} m"}, "past": {"other": "-{0} m"}}
    },
    "day": {
      "displayName": "Day",
      "relative": {"0": "today", "1": "tomorrow", "-1": "yesterday"},
      "relativeTime": {"future": {"other": "+{0} d"}, "past": {"other": "-{0} d"}}
    },
    "hour": {"displayName": "Hour", "relativeTime": {"future": {"other": "+{0} h"}, "past": {"other": "-{0} h"}}},
    "minute": {
      "displayName": "Minute",
      "relativeTime": {"future": {"other": "+{0} min"}, "past": {"other": "-{0} min"}}
    },
    "second": {
      "displayName": "Second",
      "relative": {"0": "now"},
      "relativeTime": {"future": {"other": "+{0} s"}, "past": {"other": "-{0} s"}}
    }
  }
});
ReactIntl.__addLocaleData({"locale": "en-ER", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-FJ", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-FK", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-FM", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-GD", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-GG", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-GH", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-GI", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-GM", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-GU", "parentLocale": "en"});
ReactIntl.__addLocaleData({"locale": "en-GY", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-HK", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-IE", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-IM", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-IN", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-IO", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-JE", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-JM", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-KE", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-KI", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-KN", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-KY", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-LC", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-LR", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-LS", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-MG", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-MH", "parentLocale": "en"});
ReactIntl.__addLocaleData({"locale": "en-MO", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-MP", "parentLocale": "en"});
ReactIntl.__addLocaleData({"locale": "en-MS", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-MT", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-MU", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-MW", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-MY", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-NA", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-NF", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-NG", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-NR", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-NU", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-NZ", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-PG", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-PH", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-PK", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-PN", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-PR", "parentLocale": "en"});
ReactIntl.__addLocaleData({"locale": "en-PW", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-RW", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-SB", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-SC", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-SD", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-SG", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-SH", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-SL", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-SS", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-SX", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-SZ", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-TC", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-TK", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-TO", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-TT", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-TV", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-TZ", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-UG", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-UM", "parentLocale": "en"});
ReactIntl.__addLocaleData({"locale": "en-US", "parentLocale": "en"});
ReactIntl.__addLocaleData({"locale": "en-US-POSIX", "parentLocale": "en-US"});
ReactIntl.__addLocaleData({"locale": "en-VC", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-VG", "parentLocale": "en-GB"});
ReactIntl.__addLocaleData({"locale": "en-VI", "parentLocale": "en"});
ReactIntl.__addLocaleData({"locale": "en-VU", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-WS", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-ZA", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-ZM", "parentLocale": "en-001"});
ReactIntl.__addLocaleData({"locale": "en-ZW", "parentLocale": "en-001"});
