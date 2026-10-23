# Dream Taekwondo website

Static website for **Dream Taekwondo**, 518A Larkfield Rd., East Northport, NY — served with GitHub Pages at dreamtkd.com.

## Pages
| File | Page |
|---|---|
| `index.html` | Home (photo slideshow, programs, Master Lee, reviews, free trial form) |
| `schedule.html` | Weekly class schedule |
| `parties.html` | Birthday parties (package, request form — pricing shared on request) |
| `students.html` | Students & Families — belt test study guides behind a family password |

## Common edits
- **Class times:** edit the table in `schedule.html`.
- **Party package:** edit the "Party Package" card in `parties.html`. Pricing is not shown on the site; it is shared when parents send a request.
- **Family password:** change `FAMILY_PASSWORD` in `js/students.js` (lowercase). This only hides the page from casual visitors; it is not real security.
- **Photos:** replace files in `images/` with the same file name.

## Forms
The free trial and party forms send email through [Web3Forms](https://web3forms.com).
Forms are connected to Web3Forms (key registered to usdreamtkd@gmail.com). To change the key, edit the `access_key` value in `index.html` and `parties.html`.
Until then, the forms show a message asking visitors to call.

## Old Wix addresses
`/program`, `/class-schedule`, `/belt-curriculum`, `/birthday-party`, `/contact-3`, `/private-lessions` and `/photo-albums` redirect to the matching new page so Google results and old links keep working.
