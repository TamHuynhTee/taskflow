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
 * Create-card form using Form Actions (T4.3).
 *
 * Compared with T1.2:
 *  - Controlled (useState per field): every keystroke → re-render; easy instant validation, easy
 *    cross-field rules. Uncontrolled (FormData): the DOM holds the values, read once on submit;
 *    fewer renders, less code — a good fit for "fill in and send" forms like this one.
 *  - useActionState replaces onSubmit + preventDefault + hand-rolled loading/error state:
 *    React runs the action in a transition, provides isPending, and resets the form after each action.
 *    Because the form resets itself, on error we return `values` → defaultValues so typed text isn't lost.
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

  // T2.3a: focus the title field when the form mounts (instead of autoFocus).
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
      // The real order is computed by useCardActions from the target column.
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
        <Button onClick={onCancel}>Cancel</Button>
        <SubmitButton>Create card</SubmitButton>
      </FormActions>
    </form>
  );
}
