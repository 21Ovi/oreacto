# useDynamicFields

Generate dynamic form fields based on a numeric input.

---

## Overview

`useDynamicFields` automatically creates an array of field objects based on a parent value. Perfect for dynamic forms where users specify how many inputs they need.

**Use Cases:**
- "How many items?" → Generate N input fields
- Dynamic team member forms
- Variable product options
- Repeating form sections
- Survey builders

---

## Installation

```bash
npm install oreacto
```

---

## Basic Usage

```typescript
import { useDynamicFields } from "oreacto";

function DynamicForm() {
  const [count, setCount] = useState(3);

  const fields = useDynamicFields(count, "item", {
    label: "Item",
    value: "",
    type: "text",
  });

  return (
    <div>
      <input
        type="number"
        value={count}
        onChange={(e) => setCount(Number(e.target.value))}
      />

      {fields.map((field, index) => (
        <div key={field.fieldName}>
          <label>{field.label}</label>
          <input name={field.fieldName} type={field.type} />
        </div>
      ))}
    </div>
  );
}
```

**Result:** Creates fields named `item[0]`, `item[1]`, `item[2]` with labels "Item 1", "Item 2", "Item 3"

---

## API Reference

```typescript
function useDynamicFields(
  parentValue: number | undefined,
  fieldName: string,
  fieldTemplate: FieldTemplate
): DynamicField[]
```

### Parameters

| Parameter      | Type                | Description                                      |
| -------------- | ------------------- | ------------------------------------------------ |
| `parentValue`  | `number \| undefined` | Number of fields to generate                     |
| `fieldName`    | `string`            | Base name for generated fields                   |
| `fieldTemplate` | `FieldTemplate`     | Template object for each field (with `label`)    |

### Returns

**`DynamicField[]`** - Array of field objects

Each field contains:
- `fieldName`: `string` - Generated field name (e.g., `"item[0]"`)
- `label`: `string` - Generated label (e.g., `"Item 1"`)
- ...all properties from `fieldTemplate`

---

## Examples

### Team Member Form

```typescript
import { useDynamicFields } from "oreacto";
import { useState, useMemo } from "react";

function TeamForm() {
  const [memberCount, setMemberCount] = useState(1);

  const fieldTemplate = useMemo(
    () => ({
      label: "Team Member",
      name: "",
      email: "",
      role: "Developer",
    }),
    []
  );

  const memberFields = useDynamicFields(memberCount, "members", fieldTemplate);

  return (
    <form>
      <label>
        How many team members?
        <input
          type="number"
          min="1"
          max="10"
          value={memberCount}
          onChange={(e) => setMemberCount(Number(e.target.value))}
        />
      </label>

      {memberFields.map((field, index) => (
        <fieldset key={field.fieldName}>
          <legend>{field.label}</legend>
          <input
            name={`${field.fieldName}.name`}
            placeholder="Name"
            required
          />
          <input
            name={`${field.fieldName}.email`}
            type="email"
            placeholder="Email"
            required
          />
          <select name={`${field.fieldName}.role`}>
            <option>Developer</option>
            <option>Designer</option>
            <option>Manager</option>
          </select>
        </fieldset>
      ))}

      <button type="submit">Create Team</button>
    </form>
  );
}
```

### Product Variations

```typescript
import { useDynamicFields } from "oreacto";
import { useState, useMemo } from "react";

function ProductVariations() {
  const [variantCount, setVariantCount] = useState(2);
  const [formData, setFormData] = useState({});

  const variantTemplate = useMemo(
    () => ({
      label: "Variant",
      size: "",
      color: "",
      price: 0,
      sku: "",
    }),
    []
  );

  const variants = useDynamicFields(variantCount, "variants", variantTemplate);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted:", formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Number of Variants:
        <input
          type="number"
          min="1"
          value={variantCount}
          onChange={(e) => setVariantCount(Number(e.target.value))}
        />
      </label>

      {variants.map((variant) => (
        <div key={variant.fieldName} className="variant-card">
          <h3>{variant.label}</h3>
          <input placeholder="Size (S, M, L)" />
          <input placeholder="Color" />
          <input type="number" placeholder="Price" step="0.01" />
          <input placeholder="SKU" />
        </div>
      ))}

      <button type="submit">Save Product</button>
    </form>
  );
}
```

### Survey Builder

```typescript
import { useDynamicFields } from "oreacto";
import { useState, useMemo } from "react";

function SurveyBuilder() {
  const [questionCount, setQuestionCount] = useState(3);

  const questionTemplate = useMemo(
    () => ({
      label: "Question",
      text: "",
      type: "text",
      required: false,
    }),
    []
  );

  const questions = useDynamicFields(
    questionCount,
    "questions",
    questionTemplate
  );

  return (
    <div className="survey-builder">
      <div className="controls">
        <button onClick={() => setQuestionCount((c) => c + 1)}>
          + Add Question
        </button>
        <button
          onClick={() => setQuestionCount((c) => Math.max(1, c - 1))}
          disabled={questionCount === 1}
        >
          - Remove Question
        </button>
      </div>

      {questions.map((question, index) => (
        <div key={question.fieldName} className="question-editor">
          <label>{question.label}</label>
          <input
            name={`${question.fieldName}.text`}
            placeholder="Enter your question"
          />
          <select name={`${question.fieldName}.type`}>
            <option value="text">Text</option>
            <option value="number">Number</option>
            <option value="email">Email</option>
            <option value="textarea">Long Text</option>
          </select>
          <label>
            <input
              type="checkbox"
              name={`${question.fieldName}.required`}
            />
            Required
          </label>
        </div>
      ))}
    </div>
  );
}
```

### Event Registration with Guests

```typescript
import { useDynamicFields } from "oreacto";
import { useState, useMemo } from "react";

function EventRegistration() {
  const [guestCount, setGuestCount] = useState(1);

  const guestTemplate = useMemo(
    () => ({
      label: "Guest",
      fullName: "",
      dietaryRestrictions: "",
      plusOne: false,
    }),
    []
  );

  const guests = useDynamicFields(guestCount, "guests", guestTemplate);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    console.log("Registration:", Object.fromEntries(formData));
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Event Registration</h2>

      <label>
        Number of Guests:
        <input
          type="number"
          min="1"
          max="5"
          value={guestCount}
          onChange={(e) => setGuestCount(Number(e.target.value))}
        />
      </label>

      {guests.map((guest) => (
        <div key={guest.fieldName} className="guest-section">
          <h3>{guest.label}</h3>
          <input
            name={`${guest.fieldName}.fullName`}
            placeholder="Full Name"
            required
          />
          <textarea
            name={`${guest.fieldName}.dietaryRestrictions`}
            placeholder="Dietary Restrictions (optional)"
            rows={2}
          />
          <label>
            <input
              type="checkbox"
              name={`${guest.fieldName}.plusOne`}
            />
            Bringing a +1?
          </label>
        </div>
      ))}

      <button type="submit">Register for Event</button>
    </form>
  );
}
```

---

## Common Use Cases

### 1. **Dynamic Contact List**

```typescript
const contacts = useDynamicFields(contactCount, "contacts", {
  label: "Contact",
  name: "",
  phone: "",
});
```

### 2. **Variable Product Features**

```typescript
const features = useDynamicFields(featureCount, "features", {
  label: "Feature",
  title: "",
  description: "",
});
```

### 3. **Skill Assessment Forms**

```typescript
const skills = useDynamicFields(skillCount, "skills", {
  label: "Skill",
  name: "",
  level: "Beginner",
});
```

---

## Best Practices

### ✅ Do's

- **Memoize the field template** to prevent unnecessary recalculations:
  ```typescript
  const fieldTemplate = useMemo(() => ({ label: "Item", value: "" }), []);
  ```
- Provide clear labels and instructions
- Set min/max limits on field count
- Use proper validation
- Show field count prominently

### ❌ Don'ts

- Don't create the template object inline (causes re-renders)
- Avoid generating 100+ fields (UX issue)
- Don't forget unique keys when rendering
- Avoid complex nested structures (keep it simple)

---

## Performance Tips

### Memoize Template

**❌ Bad:**

```typescript
const fields = useDynamicFields(count, "items", {
  label: "Item", // Created on every render!
  value: "",
});
```

**✅ Good:**

```typescript
const template = useMemo(() => ({ label: "Item", value: "" }), []);
const fields = useDynamicFields(count, "items", template);
```

### Limit Field Count

```typescript
const MAX_FIELDS = 20;

<input
  type="number"
  min="1"
  max={MAX_FIELDS}
  value={count}
  onChange={(e) => setCount(Math.min(MAX_FIELDS, Number(e.target.value)))}
/>
```

---

## Form Handling

### With React Hook Form

```typescript
import { useForm } from "react-hook-form";
import { useDynamicFields } from "oreacto";

function DynamicFormWithValidation() {
  const [count, setCount] = useState(2);
  const { register, handleSubmit } = useForm();

  const template = useMemo(() => ({ label: "Item", value: "" }), []);
  const fields = useDynamicFields(count, "items", template);

  const onSubmit = (data) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field) => (
        <input key={field.fieldName} {...register(field.fieldName)} />
      ))}
      <button type="submit">Submit</button>
    </form>
  );
}
```

### With Formik

```typescript
import { Formik, Field, Form } from "formik";
import { useDynamicFields } from "oreacto";

function FormikDynamicFields() {
  const [count, setCount] = useState(3);

  const template = useMemo(() => ({ label: "Email", value: "" }), []);
  const fields = useDynamicFields(count, "emails", template);

  return (
    <Formik
      initialValues={{}}
      onSubmit={(values) => console.log(values)}
    >
      <Form>
        {fields.map((field) => (
          <Field key={field.fieldName} name={field.fieldName} />
        ))}
        <button type="submit">Submit</button>
      </Form>
    </Formik>
  );
}
```

---

## TypeScript

Fully typed with generics:

```typescript
interface ItemTemplate {
  label: string;
  value: string;
  category: string;
}

const template: ItemTemplate = {
  label: "Product",
  value: "",
  category: "Electronics",
};

const fields = useDynamicFields(count, "products", template);
// fields is DynamicField[] with all ItemTemplate properties
```

---

## Accessibility

- Use proper labels for all inputs
- Associate labels with inputs using `htmlFor`
- Provide clear instructions
- Use ARIA attributes for dynamic content
- Ensure keyboard navigation works

```typescript
{fields.map((field) => (
  <div key={field.fieldName}>
    <label htmlFor={field.fieldName}>{field.label}</label>
    <input id={field.fieldName} name={field.fieldName} aria-required="true" />
  </div>
))}
```

---

## Browser Support

Works in all modern browsers that support React 18+.

---

## Contributing

Found a bug or have a suggestion? Open an issue at:  
https://github.com/21Ovi/oreacto/issues

---

**Made with ❤️ by the oreacto team**

