# Translation Page - التكامل مع API

## 📁 هيكل المجلدات

```
src/pages/translation/
├── components/
│   ├── index.ts                    # تصدير جميع المكونات
│   ├── TranslationHeader.tsx       # رأس الصفحة
│   ├── ServiceStatusCard.tsx       # بطاقة حالة الخدمة
│   ├── LanguagesSection.tsx        # قسم اللغات
│   ├── LanguageCard.tsx            # بطاقة اللغة الفردية
│   ├── EmptyState.tsx              # الحالة الفارغة
│   ├── AddLanguageModal.tsx        # مودال إضافة لغة
│   └── SubscriptionModal.tsx       # مودال الاشتراك
├── TranslationPage.tsx             # الصفحة الرئيسية
├── AutomaticTranslationPage.tsx    # صفحة الترجمة التلقائية
├── ManualTranslationPage.tsx       # صفحة الترجمة اليدوية
└── README.md                       # هذا الملف
```

## 🧩 المكونات

### 1. TranslationHeader
- **الوظيفة**: عرض رأس الصفحة مع العنوان وحالة الخدمة
- **الخصائص**: `isServiceActive: boolean`

### 2. ServiceStatusCard
- **الوظيفة**: عرض بطاقة تفعيل خدمة الترجمة
- **الخصائص**: 
  - `isServiceActive: boolean`
  - `onActivate: () => void`

### 3. LanguagesSection
- **الوظيفة**: إدارة قسم اللغات بالكامل
- **الخصائص**:
  - `storeLanguages: StoreLanguage[]`
  - `onAddLanguage: () => void`
  - `onRemoveLanguage: (languageCode: string) => void`

### 4. LanguageCard
- **الوظيفة**: عرض بطاقة لغة فردية مع الإحصائيات والأزرار
- **الخصائص**:
  - `language: StoreLanguage`
  - `index: number`
  - `onRemove: (languageCode: string) => void`

### 5. EmptyState
- **الوظيفة**: عرض الحالة الفارغة عندما لا توجد لغات
- **الخصائص**: `onAddLanguage: () => void`

### 6. AddLanguageModal
- **الوظيفة**: مودال إضافة لغة جديدة مع خطوتين
- **الخصائص**:
  - `isOpen: boolean`
  - `selectedLanguageCode: LanguageCode | null`
  - `isDefaultLanguage: boolean`
  - `availableLanguages: AvailableLanguage[]`
  - `storeLanguages: StoreLanguage[]`
  - `onLanguageSelect: (languageCode: LanguageCode) => void`
  - `onAddLanguage: () => void`
  - `onCancelAdd: () => void`
  - `onDefaultLanguageChange: (isDefault: boolean) => void`
  - `languageDisplayMap: Record<LanguageCode, { name: string; flag: string }>`

## 🔌 التكامل مع API

### Endpoints المستخدمة

#### 1. جلب لغات المتجر
```typescript
// EndPoints.getLanguagesByStore(storeId)
GET /api/Language/get-all-store/{storeId}
```

#### 2. إضافة لغة جديدة
```typescript
// EndPoints.addLanguage
POST /api/Language/add-lang
```

#### 3. حذف لغة
```typescript
// EndPoints.deleteLanguage(languageId)
DELETE /api/Language/delete-lang/{languageId}
```

### دوال API المستخدمة

#### 1. fetchStoreLanguages()
```typescript
const fetchStoreLanguages = async () => {
  if (!storeId) return;
  
  try {
    dispatch(loading(true));
    await api.getAll(
      EndPoints.getLanguagesByStore(storeId),
      getAll,
      setError
    );
  } catch (error) {
    console.error("Error fetching store languages:", error);
  }
};
```

#### 2. handleAddLanguage()
```typescript
const handleAddLanguage = async () => {
  if (selectedLanguageCode !== null) {
    const displayInfo = languageDisplayMap[selectedLanguageCode];
    if (displayInfo) {
      const newLanguage: Omit<StoreLanguageDto, "id" | "dateAdded"> = {
        languageCode: selectedLanguageCode,
        languageName: displayInfo.name,
        isDefault: isDefaultLanguage,
        storeId: Number(storeId) || 0,
      };

      try {
        await api.create(EndPoints.addLanguage, newLanguage, addLanguage, setError);
        // إعادة جلب اللغات بعد الإضافة
        await fetchStoreLanguages();
      } catch (error) {
        console.error("Error adding language:", error);
      }
    }
  }
  // إعادة تعيين الحالة
  setSelectedLanguageCode(null);
  setIsDefaultLanguage(false);
  setIsAddLanguageModalOpen(false);
};
```

#### 3. handleRemoveLanguage()
```typescript
const handleRemoveLanguage = async (languageCode: string) => {
  const languageToRemove = reduxLanguages.find(
    (lang) => LanguageCode[lang.languageCode] === languageCode
  );
  if (languageToRemove) {
    try {
      await api.delete(
        EndPoints.deleteLanguage(languageToRemove.id.toString()),
        languageToRemove.id.toString(),
        deleteLanguage,
        setError
      );
      // إعادة جلب اللغات بعد الحذف
      await fetchStoreLanguages();
    } catch (error) {
      console.error("Error deleting language:", error);
    }
  }
};
```

## 🔄 إدارة الحالة

### Redux Store
```typescript
// StoreLanguageSlice
interface StoreLanguageState {
  storeLanguages: StoreLanguageDto[];
  loading: boolean;
  error: string | null;
}

// Actions
- getAll: جلب جميع اللغات
- addLanguage: إضافة لغة جديدة
- deleteLanguage: حذف لغة
- loading: تعيين حالة التحميل
- setError: تعيين رسالة الخطأ
```

### Local State
```typescript
const [isSubscriptionModalOpen, setIsSubscriptionModalOpen] = useState(false);
const [isServiceActive, setIsServiceActive] = useState(false);
const [isAddLanguageModalOpen, setIsAddLanguageModalOpen] = useState(false);
const [selectedLanguageCode, setSelectedLanguageCode] = useState<LanguageCode | null>(null);
const [isDefaultLanguage, setIsDefaultLanguage] = useState(false);
```

## 🔧 التحسينات المطبقة

### 1. التكامل مع API
- جلب اللغات من الخادم عند تحميل الصفحة
- إضافة لغات جديدة عبر API
- حذف لغات عبر API
- إعادة جلب البيانات بعد كل عملية

### 2. إدارة الأخطاء
- معالجة أخطاء API
- عرض رسائل خطأ مناسبة
- تسجيل الأخطاء في Console

### 3. تحسين الأداء
- إعادة جلب البيانات فقط عند الحاجة
- استخدام Redux للتحكم في الحالة
- تحسين إعادة التصيير

### 4. TypeScript
- أنواع قوية ومحددة
- واجهات واضحة
- تقليل الأخطاء

## 🎨 التصميم

### الألوان المستخدمة
- **Primary**: `primary-500` إلى `primary-600`
- **Secondary**: `secondary-500` إلى `secondary-600`
- **Accent**: `accent-500` إلى `accent-600`

### الرسوم المتحركة
- `animate-fade-in`: ظهور تدريجي
- `animate-scale-in`: تكبير تدريجي
- `animate-slide-up`: انزلاق لأعلى
- `animate-bounce-slow`: نطاط بطيء
- `animate-pulse`: نبض

## 📱 الاستجابة
- تصميم متجاوب لجميع الأحجام
- Grid system مرن
- Breakpoints محددة

## 🚀 الاستخدام

```tsx
import TranslationPage from './pages/translation/TranslationPage';

// في الراوتر
<Route path="/store/:storeId/translation" element={<TranslationPage />} />
```

## 📝 ملاحظات التطوير

1. **إضافة مكونات جديدة**: أضف الملف في مجلد `components` ثم اصدره في `index.ts`
2. **تعديل التصميم**: استخدم الألوان والرسوم المتحركة المحددة
3. **إضافة وظائف**: اتبع نمط Props للتواصل بين المكونات
4. **الاختبار**: كل مكون قابل للاختبار بشكل منفصل
5. **API Integration**: استخدم ApiRepository للتعامل مع الخادم
6. **Error Handling**: تعامل مع الأخطاء بشكل مناسب

## 🔍 Debugging

### Console Logs
```typescript
console.log('Selected language code:', languageCode);
console.log('Adding language with code:', selectedLanguageCode, 'isDefault:', isDefaultLanguage);
console.log('New language object:', newLanguage);
console.error("Error fetching store languages:", error);
console.error("Error adding language:", error);
console.error("Error deleting language:", error);
```

### Network Tab
- تحقق من طلبات API في Network Tab
- تأكد من صحة البيانات المرسلة والمستلمة
- تحقق من رموز الاستجابة (200, 400, 500, etc.) 