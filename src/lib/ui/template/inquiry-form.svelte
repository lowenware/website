<script lang="ts">
  import type { Locale } from '$lib/shared/defaults';
  import Button from '$lib/ui/toolkit/button.svelte';
  import { _ } from '$lib/i18n';

  type Props = {
    lang: Locale;
    inquiryApiUrl: string;
  };

  let { lang, inquiryApiUrl }: Props = $props();

  let name = $state('');
  let emailInput = $state('');
  let message = $state('');
  let privacyPolicyConsent = $state(false);
  let status = $state<'idle' | 'sending' | 'success' | 'error'>('idle');

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function validate(): string | null {
    if (!name.trim()) return 'Name is required.';
    if (!emailInput.trim() || !emailPattern.test(emailInput.trim()))
      return 'A valid email address is required.';
    if (!message.trim()) return 'Message is required.';
    if (!privacyPolicyConsent) return 'You must accept the Privacy Statement.';
    return null;
  }

  async function handleSubmit(event: SubmitEvent) {
    event.preventDefault();
    const error = validate();
    if (error) return;

    status = 'sending';
    try {
      const response = await fetch(inquiryApiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          email: emailInput.trim(),
          message: message.trim(),
          privacyPolicyConsent: true
        })
      });

      if (!response.ok) throw new Error('Request failed');

      status = 'success';
      name = '';
      emailInput = '';
      message = '';
      privacyPolicyConsent = false;
    } catch {
      status = 'error';
    }
  }
</script>

{#if status === 'success'}
  <div class="alert alert-success" role="status">
    <p>{$_('inquiry.form.success')}</p>
  </div>
{:else}
  <form class="inquiry-form" onsubmit={handleSubmit} novalidate>
    {#if status === 'error'}
      <div class="alert alert-error" role="alert">
        <p>{$_('inquiry.form.error')}</p>
      </div>
    {/if}

    <div class="field">
      <label for="inquiry-name">{$_('inquiry.form.name')}</label>
      <input
        id="inquiry-name"
        class="input"
        type="text"
        name="name"
        autocomplete="name"
        required
        placeholder={$_('inquiry.form.namePlaceholder')}
        bind:value={name}
        disabled={status === 'sending'}
      />
    </div>

    <div class="field">
      <label for="inquiry-email">{$_('inquiry.form.email')}</label>
      <input
        id="inquiry-email"
        class="input"
        type="email"
        name="email"
        autocomplete="email"
        required
        placeholder={$_('inquiry.form.emailPlaceholder')}
        bind:value={emailInput}
        disabled={status === 'sending'}
      />
    </div>

    <div class="field">
      <label for="inquiry-message">{$_('inquiry.form.message')}</label>
      <textarea
        id="inquiry-message"
        class="input textarea"
        name="message"
        rows="6"
        required
        placeholder={$_('inquiry.form.messagePlaceholder')}
        bind:value={message}
        disabled={status === 'sending'}
      ></textarea>
    </div>

    <div class="field checkbox-field">
      <input
        id="inquiry-privacy"
        type="checkbox"
        name="privacyPolicyConsent"
        required
        bind:checked={privacyPolicyConsent}
        disabled={status === 'sending'}
      />
      <label for="inquiry-privacy">
        {$_('inquiry.form.privacy')}
        <a href="/{lang}/privacy/">{$_('inquiry.form.privacyLink')}</a>
      </label>
    </div>

    <Button type="submit" variant="primary" disabled={status === 'sending'}>
      {status === 'sending' ? $_('inquiry.form.sending') : $_('inquiry.form.submit')}
    </Button>
  </form>
{/if}

<style>
  .inquiry-form {
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    max-width: 36rem;
    width: 100%;
  }

  .field {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
  }

  .field label {
    font-size: 0.875rem;
    font-weight: 700;
    color: #fff;
  }

  .checkbox-field {
    flex-direction: row;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .checkbox-field label {
    font-weight: 400;
    line-height: 1.5;
    padding: 0.5rem 0;
    cursor: pointer;
  }

  .checkbox-field input[type='checkbox'] {
    margin-top: 0.5rem;
    width: 1.25rem;
    height: 1.25rem;
    min-width: 1.25rem;
    flex-shrink: 0;
    accent-color: var(--color-blue-brand);
    cursor: pointer;
  }

  .inquiry-form :global(.btn) {
    width: 100%;
  }

  @media (min-width: 480px) {
    .inquiry-form :global(.btn) {
      width: auto;
      align-self: flex-start;
    }
  }

  .textarea {
    resize: vertical;
    min-height: 8rem;
  }

  .alert {
    padding: 1rem 1.25rem;
    border-radius: 0.5rem;
    max-width: 36rem;
    width: 100%;
  }
</style>
