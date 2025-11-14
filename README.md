# نظام إدارة مصروفات المزرعة

## المميزات

- ✅ تسجيل حساب جديد وتسجيل الدخول
- ✅ إضافة مصروفات جديدة
- ✅ عرض جميع المصروفات
- ✅ تعديل المصروفات
- ✅ حذف المصروفات
- ✅ إحصائيات المصروفات
- ✅ فلترة حسب الفئة والتاريخ

## الفئات المتاحة

- إيجار وأرض (rent_land)
- حرث (plowing)
- طبيب (doctor)
- علف (feed)
- بناء (construction)
- صيانة (maintenance)
- تقاوي وبذور (seeds)

## التشغيل

### Backend

```bash
cd backend
npm install
npm start
```

الخادم سيعمل على `http://localhost:5000`

### Frontend

```bash
cd frontend
npm install
npm run dev
```

الواجهة ستعمل على `http://localhost:3000`

## كيفية الاستخدام

1. **إنشاء حساب جديد**: 
   - افتح الواجهة الأمامية
   - اضغط على "ليس لديك حساب؟ سجل الآن"
   - أدخل الاسم، رقم الجوال، وكلمة المرور
   - اضغط "إنشاء حساب"

2. **تسجيل الدخول**:
   - أدخل رقم الجوال وكلمة المرور
   - اضغط "تسجيل الدخول"

3. **إدارة المصروفات**:
   - بعد تسجيل الدخول، يمكنك إضافة وتعديل وحذف المصروفات
   - عرض الإحصائيات في أعلى الصفحة

## API Endpoints

### المصادقة
- `POST /api/farm/auth/register` - إنشاء حساب جديد
- `POST /api/farm/auth/login` - تسجيل الدخول
- `GET /api/farm/auth/me` - معلومات المستخدم الحالي (يحتاج مصادقة)

### المصروفات
- `GET /api/farm/expenses` - جلب جميع المصروفات
- `GET /api/farm/expenses/stats` - إحصائيات المصروفات
- `GET /api/farm/expenses/:id` - جلب مصروف محدد
- `POST /api/farm/expenses` - إنشاء مصروف جديد
- `PUT /api/farm/expenses/:id` - تحديث مصروف
- `DELETE /api/farm/expenses/:id` - حذف مصروف

## ملاحظات

- تأكد من إعداد متغيرات البيئة في ملف `.env` في مجلد backend:
  ```
  MONGO_URI=mongodb://localhost:27017/my-farm
  JWT_SECRET=your-secret-key-here
  JWT_EXPIRES_IN=30d
  FRONTEND_URL=http://localhost:3000
  PORT=5000
  ```

