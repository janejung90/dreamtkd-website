# Dream Taekwondo website

Static website for **Dream Taekwondo**, 518A Larkfield Rd., East Northport, NY — served with GitHub Pages at dreamtkd.com.

## Pages
| File | Page |
|---|---|
| `index.html` | Home (photo slideshow, programs, Master Lee, reviews, free trial form) |
| `schedule.html` | Weekly class schedule |
| `parties.html` | Birthday parties (package, price, request form) |
| `students.html` | Students & Families — belt test study guides behind a family password |

## Common edits
- **Class times:** edit the table in `schedule.html`.
- **Party price / package:** edit the "Party Package" card in `parties.html`.
- **Family password:** change `FAMILY_PASSWORD` in `js/students.js` (lowercase). This only hides the page from casual visitors; it is not real security.
- **Photos:** replace files in `images/` with the same file name.

## Forms
The free trial and party forms send email through [Web3Forms](https://web3forms.com).
Replace `YOUR_WEB3FORMS_ACCESS_KEY` in `index.html` and `parties.html` with the access key for usdreamtkd@gmail.com.
Until then, the forms show a message asking visitors to call.

## Old Wix addresses
`/program`, `/class-schedule`, `/belt-curriculum`, `/birthday-party`, `/contact-3`, `/private-lessions` and `/photo-albums` redirect to the matching new page so Google results and old links keep working.
