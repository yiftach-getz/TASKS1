# מנהל משימות

אפליקציית ניהול משימות פשוטה המבוססת על HTML, CSS ו-JavaScript עם שמירת נתונים ב-Supabase.

## תכונות

- הוספת משימות חדשות
- סימון משימות כהושלמו
- מחיקת משימות
- סינון משימות (הכל/פעיל/הושלם)
- שמירת נתונים ב-Supabase
- ממשק משתמש בעברית
- תמיכה מלאה ב-RTL

## התקנה

1. העתק את הפרויקט למחשב שלך
2. פתח את `index.html` בדפדפן

## הגדרת Supabase

1. צור פרויקט חדש ב-Supabase
2. הרץ את ה-SQL הבא ב-SQL Editor:

```sql
create table tasks (
  id bigint primary key generated always as identity,
  text text not null,
  completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create policy "Enable read access for all users" on tasks for
    select using (true);

create policy "Enable insert access for all users" on tasks for
    insert with check (true);

create policy "Enable update access for all users" on tasks for
    update using (true);

create policy "Enable delete access for all users" on tasks for
    delete using (true);
```

3. החלף את ה-URL וה-Key בקובץ `script.js` עם הפרטים שלך מ-Supabase 