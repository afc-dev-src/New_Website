# Admin Guide (Foreclosed Properties)

## 1. Start the app

Run these in separate terminals:

```bash
npm run api
```

```bash
npm run dev
```

Frontend: `http://localhost:5173`  
Admin page: `http://localhost:5173/admin`

## 2. Login credentials

Default login:

- Username: `admin`
- Password: `ChangeMe123!`

This is auto-created in `server/data/admin-users.json` on first run.

## 3. Manage properties (non-technical flow)

On `/admin`:

1. Click a property on the left to edit it.
2. Or click `+ New` to add one.
3. Fill in the form fields.
4. Upload property images using `Property Image Upload` (optional, up to 10 images).
5. Click `Save Changes` or `Add Property`.
6. Use `Delete` to remove a property.

Changes are saved in:

- `server/data/properties.json`

The public `Foreclosed Properties` pages automatically read from this backend.
The first uploaded image is used as the main card image in listings.

## 4. Credential login logging

Every admin login attempt is logged with:

- timestamp
- username
- success/failed result
- IP address
- user agent

Stored in:

- `server/data/auth-log.json`

Shown in the admin page as `Credential Login Activity`.

## 5. Important security note

Login activity is logged, but passwords are **not** stored in logs.
