import { useActionState, useEffect, useRef } from "react";
import { Button } from "../../components/ui";
import { SubmitButton } from "../../components/SubmitButton";
import { useBoardState, useCardActions } from "../../context/BoardContext";
import type { Card, CardFormErrors, CardFormValues } from "../../types";
import { errorText } from "../../utils/error";
import { createCardFromForm, readCardForm, validateCardForm } from "./cardForm";
import { CardFormFields, FormActions, FormMessage } from "./CardFormFields";

interface CreateCardFormProps {
  boardId: string;
  today: string;
  onCreated: (card: Card) => void;
  onCancel: () => void;
}

type CreateCardState = {
  errors?: CardFormErrors;
  values?: Partial<CardFormValues>;
  createdId?: string;
};

/**
 * Form tạo card bằng Form Actions (T4.3).
 *
 * So với T1.2:
 *  - Controlled (useState cho từng ô): mỗi phím gõ → re-render; dễ validate tức thì, dễ
 *    ràng buộc giữa các ô. Uncontrolled (FormData): DOM giữ giá trị, đọc 1 lần khi submit;
 *    ít render, ít code — hợp với form "điền rồi gửi" như form này.
 *  - useActionState thay cho onSubmit + preventDefault + state loading/error thủ công:
 *    React tự chạy action trong transition, cung cấp isPending, và reset form sau mỗi action.
 *    Vì form tự reset nên khi có lỗi phải trả lại `values` → defaultValues để không mất chữ đã gõ.
 */
export function CreateCardForm({
  boardId,
  today,
  onCreated,
  onCancel,
}: CreateCardFormProps) {
  const { users } = useBoardState();
  const actions = useCardActions();
  const titleRef = useRef<HTMLInputElement>(null);

  // T2.3a: focus ô tiêu đề khi form mount (thay cho autoFocus).
  useEffect(() => {
    titleRef.current?.focus();
  }, []);

  async function createCardAction(
    _prev: CreateCardState,
    formData: FormData,
  ): Promise<CreateCardState> {
    const values = readCardForm(formData);
    const errors = validateCardForm(values, today);
    if (Object.keys(errors).length > 0) return { errors, values };
    try {
      // order thật do useCardActions tính theo cột đích.
      const card = await actions.create(createCardFromForm(values, boardId, 0));
      onCreated(card);
      return { createdId: card.id };
    } catch (error) {
      return { errors: { form: errorText(error) }, values };
    }
  }

  const [state, formAction] = useActionState(createCardAction, {});

  return (
    <form action={formAction} noValidate>
      <CardFormFields
        users={users}
        errors={state.errors}
        defaultValues={state.values}
        titleRef={titleRef}
      />
      {state.errors?.form && <FormMessage>{state.errors.form}</FormMessage>}
      <FormActions>
        <Button onClick={onCancel}>Huỷ</Button>
        <SubmitButton>Tạo card</SubmitButton>
      </FormActions>
    </form>
  );
}
