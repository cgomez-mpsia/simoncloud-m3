import Button from './components/atoms/Button'
import Alert from './components/molecules/Alert'
import Tabs from './components/molecules/Tabs'
import Card from './components/molecules/Card'
import Badge from './components/atoms/Badge'
import IconButton from './components/atoms/IconButton'
import AvatarLogo from './components/atoms/AvatarLogo'
import SectionHeader from './components/molecules/SectionHeader'
import HeroSection from './components/organisms/HeroSection'
import Navbar from './components/organisms/Navbar'
import SidebarNavItem from './components/molecules/SidebarNavItem'
import TextInput from './components/atoms/TextInput'
import FormField from './components/molecules/FormField'
import CopyButton from './components/molecules/CopyButton'
import Header from './components/organisms/Header'
import Avatar from './components/atoms/Avatar'
import Checkbox from './components/atoms/Checkbox'
import Select from './components/molecules/Select'
import Switch from './components/atoms/Switch'
import DataTable from './components/organisms/DataTable'
import {
  Modal,
  ModalTrigger,
  ModalContent,
  ModalHeader,
  ModalTitle,
  ModalDescription,
  ModalBody,
  ModalFooter,
  ModalClose,
} from './components/molecules/Modal'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
} from './components/molecules/DropdownMenu'

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-12">
      <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--foreground-muted)] mb-6 pb-2 border-b border-[var(--border-muted)]">
        {title}
      </h2>
      {children}
    </div>
  )
}

export default function App() {
  return (
    <div className="min-h-screen">
      {/* Navbar preview — full width, no padding */}
      <Navbar
        githubStars="103.4K"
        items={[
          {
            label: 'Product',
            children: [
              { label: 'Database', href: '/database', description: 'Postgres database with instant APIs' },
              { label: 'Authentication', href: '/auth', description: 'User management and auth' },
              { label: 'Storage', href: '/storage', description: 'File storage at scale' },
              { label: 'Edge Functions', href: '/edge-functions', description: 'Serverless functions globally' },
            ],
          },
          {
            label: 'Developers',
            children: [
              { label: 'Documentation', href: '/docs', description: 'Guides and references' },
              { label: 'Changelog', href: '/changelog', description: 'Latest updates' },
            ],
          },
          {
            label: 'Solutions',
            children: [
              { label: 'Startups', href: '/solutions/startups', description: 'Built for early-stage teams' },
              { label: 'Enterprise', href: '/solutions/enterprise', description: 'Scale with confidence' },
            ],
          },
          { label: 'Pricing', href: '/pricing' },
          { label: 'Docs', href: '/docs' },
          { label: 'Blog', href: '/blog' },
        ]}
      />

    <div className="p-12 max-w-4xl mx-auto">
      <div className="mb-16">
        <h1 className="text-3xl font-semibold text-[var(--foreground-default)] mb-2">
          Design System
        </h1>
        <p className="text-[var(--foreground-lighter)]">Supabase · Component Preview</p>
      </div>

      <Section title="SidebarNavItem">
        <ul className="w-56 bg-[var(--background-surface-75)] rounded-lg p-2 flex flex-col gap-0.5">
          <SidebarNavItem
            href="#"
            active
            label="Projects"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.97 12.92A2 2 0 0 0 2 14.63v3.24a2 2 0 0 0 .97 1.71l3 1.8a2 2 0 0 0 2.06 0L12 19v-5.5l-5-3-4.03 2.42Z"/><path d="m7 16.5-4.74-2.85"/><path d="m7 16.5 5-3"/><path d="M7 16.5v5.17"/><path d="M12 13.5V19l3.97 2.38a2 2 0 0 0 2.06 0l3-1.8a2 2 0 0 0 .97-1.71v-3.24a2 2 0 0 0-.97-1.71L17 10.5l-5 3Z"/><path d="m17 16.5-5-3"/><path d="m17 16.5 4.74-2.85"/><path d="M17 16.5v5.17"/><path d="M7.97 4.42A2 2 0 0 0 7 6.13v4.37l5 3 5-3V6.13a2 2 0 0 0-.97-1.71l-3-1.8a2 2 0 0 0-2.06 0l-3 1.8Z"/><path d="M12 8 7.26 5.15"/><path d="m12 8 4.74-2.85"/><path d="M12 13.5V8"/>
              </svg>
            }
          />
          <SidebarNavItem
            href="#"
            label="Team"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
              </svg>
            }
          />
          <SidebarNavItem
            href="#"
            label="Integrations"
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>
              </svg>
            }
          />
          <SidebarNavItem href="#" label="Billing" />
          <SidebarNavItem href="#" label="Organization Settings" />
        </ul>
      </Section>

      <Section title="Card">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Project card — matches mhtml structure exactly */}
          <Card
            href="#"
            header={
              <div className="flex flex-col gap-y-0.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm shrink truncate pr-5 text-[var(--foreground-default)]">
                    my-project
                  </h5>
                  <Badge variant="warning">Production</Badge>
                </div>
                <p className="text-sm text-[var(--foreground-lighter)]">AWS | us-west-2</p>
              </div>
            }
            footer={
              <Alert
                icon={
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/>
                  </svg>
                }
              >
                Project is paused
              </Alert>
            }
            className="h-44"
          />
          {/* Card without footer */}
          <Card
            href="#"
            header={
              <div className="flex flex-col gap-y-0.5">
                <div className="flex items-center justify-between">
                  <h5 className="text-sm shrink truncate pr-5 text-[var(--foreground-default)]">Demo Project</h5>
                  <Badge variant="default">Free</Badge>
                </div>
                <p className="text-sm text-[var(--foreground-lighter)]">AWS | us-east-1</p>
              </div>
            }
            className="h-44"
          />
          {/* Static card (no href) */}
          <Card className="p-5">
            <p className="text-sm text-[var(--foreground-lighter)]">Static card without link</p>
          </Card>
        </div>
      </Section>

      <Section title="Tabs">
        <Tabs
          items={[
            { value: 'table', label: 'Table Editor', content: <p className="text-sm text-[var(--foreground-lighter)] text-center py-4">Table Editor content</p> },
            { value: 'sql', label: 'SQL Editor', content: <p className="text-sm text-[var(--foreground-lighter)] text-center py-4">SQL Editor content</p> },
            { value: 'rls', label: 'RLS Policies', content: <p className="text-sm text-[var(--foreground-lighter)] text-center py-4">RLS Policies content</p> },
          ]}
        />
      </Section>

      <Section title="Alert">
        <div className="flex flex-col gap-3 max-w-sm">
          <Alert
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><line x1="10" x2="10" y1="15" y2="9"/><line x1="14" x2="14" y1="15" y2="9"/>
              </svg>
            }
          >
            Project is paused
          </Alert>
          <Alert
            icon={
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/><path d="M12 8v4m0 4h.01"/>
              </svg>
            }
            action={
              <button className="ml-auto text-[var(--foreground-lighter)] hover:text-[var(--foreground-default)] transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/>
                </svg>
              </button>
            }
          >
            Your project will be paused in 7 days due to inactivity.
          </Alert>
          <Alert>No icon variant — message only</Alert>
        </div>
      </Section>

      <Section title="Header (dashboard top bar)">
        <Header
          breadcrumb={[
            { label: 'My Org', switcher: true, badge: <Badge variant="default">FREE</Badge> },
            { label: 'my-project', switcher: true },
            { label: 'main', switcher: true, badge: <Badge variant="warning">PRODUCTION</Badge> },
          ]}
          primaryAction={<Button variant="primary" size="tiny">Subir</Button>}
          headerLink={
            <a href="#" className="text-sm text-[var(--foreground-light)] hover:text-[var(--foreground-default)] transition-colors">
              HeaderLink
            </a>
          }
          searchPlaceholder="Buscar..."
        />
      </Section>

      <Section title="TextInput">
        <div className="flex flex-col gap-3 max-w-sm">
          <TextInput placeholder="Project name" defaultValue="my-project" />
          <TextInput placeholder="Read only" defaultValue="proj_abc123" readOnly />
          <TextInput placeholder="Disabled" disabled />
        </div>
      </Section>

      <Section title="CopyButton">
        <div className="flex items-center gap-3">
          <CopyButton value="9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08" />
          <CopyButton value="proj_abc123" label="Copy ID" />
        </div>
      </Section>

      <Section title="FormField">
        <div className="max-w-md rounded-lg border border-[var(--border-muted)] bg-[var(--background-surface-75)]">
          <FormField
            label="Project name"
            htmlFor="ff-name"
            description="Displayed throughout the dashboard."
          >
            <TextInput id="ff-name" defaultValue="my-project" />
          </FormField>
          <FormField
            label="Project ID"
            htmlFor="ff-id"
            description="Use this to reference your project in the API."
            action={<CopyButton value="proj_abc123" />}
          >
            <TextInput id="ff-id" defaultValue="proj_abc123" readOnly />
          </FormField>
        </div>
      </Section>

      <Section title="Checkbox">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-[var(--foreground-light)]">
            <Checkbox defaultChecked /> Checked
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--foreground-light)]">
            <Checkbox /> Unchecked
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <Checkbox disabled /> Disabled
          </label>
        </div>
      </Section>

      <Section title="Switch">
        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm text-[var(--foreground-light)]">
            <Switch defaultChecked /> Enabled
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--foreground-light)]">
            <Switch /> Disabled state
          </label>
          <label className="flex items-center gap-2 text-sm text-[var(--foreground-muted)]">
            <Switch disabled /> Not editable
          </label>
        </div>
      </Section>

      <Section title="DataTable">
        <DataTable
          data={[
            { id: '1', file: 'tesis_final.pdf', status: 'Closed', date: '2026-06-20' },
            { id: '2', file: 'anexo_a.pdf', status: 'Open', date: '2026-06-22' },
            { id: '3', file: 'defensa.pptx', status: 'Open', date: '2026-06-25' },
          ]}
          getRowKey={(r) => r.id}
          columns={[
            { key: 'file', header: 'File' },
            {
              key: 'status',
              header: 'Status',
              render: (r) => <Badge variant={r.status === 'Closed' ? 'warning' : 'default'}>{r.status}</Badge>,
            },
            { key: 'date', header: 'Uploaded', align: 'right' },
          ]}
        />
      </Section>

      <Section title="Select">
        <div className="flex flex-wrap items-center gap-4">
          <Select
            aria-label="Token TTL"
            placeholder="Expiration…"
            defaultValue="72h"
            options={[
              { value: '24h', label: '24 hours' },
              { value: '48h', label: '48 hours' },
              { value: '72h', label: '72 hours (max)' },
            ]}
          />
          <Select
            aria-label="Log level"
            placeholder="Level…"
            options={[
              { value: 'info', label: 'Info' },
              { value: 'warning', label: 'Warning' },
              { value: 'error', label: 'Error' },
            ]}
          />
        </div>
      </Section>

      <Section title="Modal">
        <Modal>
          <ModalTrigger asChild>
            <Button variant="default" size="small">Open modal</Button>
          </ModalTrigger>
          <ModalContent>
            <ModalHeader>
              <ModalTitle>Generate external token</ModalTitle>
              <ModalDescription>Create a temporary link to share this SimonDrop.</ModalDescription>
            </ModalHeader>
            <ModalBody>
              <div className="flex flex-col gap-3">
                <Select
                  aria-label="Token TTL"
                  defaultValue="72h"
                  options={[
                    { value: '24h', label: '24 hours' },
                    { value: '48h', label: '48 hours' },
                    { value: '72h', label: '72 hours (max)' },
                  ]}
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <ModalClose asChild>
                <Button variant="default" size="small">Cancel</Button>
              </ModalClose>
              <Button variant="primary" size="small">Generate</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Section>

      <Section title="DropdownMenu (user menu)">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button aria-label="Open user menu" className="rounded-full outline-hidden focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--brand-900)]">
              <Avatar size={28} alt="User" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <div className="px-3 py-2">
              <p className="text-sm font-medium text-[var(--foreground-default)]">Carlos Gomez</p>
              <p className="text-xs text-[var(--foreground-lighter)]">user@example.com</p>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Account</DropdownMenuItem>
            <DropdownMenuItem>Feature previews</DropdownMenuItem>
            <DropdownMenuItem>Changelog</DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuLabel>Theme</DropdownMenuLabel>
            <DropdownMenuRadioGroup defaultValue="system">
              <DropdownMenuRadioItem value="dark">Dark</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="light">Light</DropdownMenuRadioItem>
              <DropdownMenuRadioItem value="system">System</DropdownMenuRadioItem>
            </DropdownMenuRadioGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </Section>

      <Section title="Badge">
        <div className="flex flex-wrap items-center gap-3">
          <Badge variant="default">Free</Badge>
          <Badge variant="warning">Production</Badge>
          <Badge variant="destructive">Paused</Badge>
          <Badge variant="brand">New</Badge>
        </div>
      </Section>

      <Section title="Button · Variants">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary">Start your project</Button>
          <Button variant="default">Documentation</Button>
          <Button variant="outline">Learn more</Button>
          <Button variant="ghost">Dismiss</Button>
        </div>
      </Section>

      <Section title="Button · Sizes">
        <div className="flex flex-wrap items-end gap-4">
          <Button variant="primary" size="tiny">Tiny</Button>
          <Button variant="primary" size="small">Small</Button>
          <Button variant="primary" size="medium">Medium</Button>
          <Button variant="primary" size="large">Large</Button>
        </div>
      </Section>

      <Section title="Button · As Link">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" href="https://supabase.com" target="_blank" rel="noreferrer">
            External link
          </Button>
          <Button variant="default" href="/docs">
            Internal link
          </Button>
        </div>
      </Section>

      <Section title="IconButton">
        <div className="flex items-center gap-4">
          <IconButton label="Open menu">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="6" x2="21" y2="6" /><line x1="3" y1="12" x2="21" y2="12" /><line x1="3" y1="18" x2="21" y2="18" />
            </svg>
          </IconButton>
          <IconButton label="Close">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </IconButton>
          <IconButton label="Search">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </IconButton>
        </div>
        <p className="mt-4 mb-2 text-xs text-[var(--foreground-lighter)]">variant="outline" (circular, bordered — header style)</p>
        <div className="flex items-center gap-3">
          <IconButton variant="outline" label="Help">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" /><path d="M12 17h.01" />
            </svg>
          </IconButton>
          <IconButton variant="outline" label="Terminal">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="4 17 10 11 4 5" /><line x1="12" y1="19" x2="20" y2="19" />
            </svg>
          </IconButton>
        </div>
      </Section>

      <Section title="AvatarLogo">
        <div className="flex flex-wrap items-center gap-2">
          <AvatarLogo href="#" name="React">
            <svg width="45" height="45" viewBox="0 0 61 61" fill="none" xmlns="http://www.w3.org/2000/svg"><circle cx="30.5" cy="30.5" r="6" fill="currentColor"/><ellipse cx="30.5" cy="30.5" rx="24" ry="9" stroke="currentColor" strokeWidth="2" fill="none"/><ellipse cx="30.5" cy="30.5" rx="24" ry="9" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(60 30.5 30.5)"/><ellipse cx="30.5" cy="30.5" rx="24" ry="9" stroke="currentColor" strokeWidth="2" fill="none" transform="rotate(120 30.5 30.5)"/></svg>
          </AvatarLogo>
          <AvatarLogo href="#" name="Next.js">
            <svg width="45" height="45" viewBox="0 0 61 61" fill="none"><path d="M42.3 48.7C38.9 50.9 34.8 52.3 30.4 52.3C18.5 52.3 8.9 42.6 8.9 30.7C8.9 18.8 18.5 9.2 30.4 9.2C42.3 9.2 51.9 18.8 51.9 30.7C51.9 37.2 49.1 43 44.7 46.9L39.6 40.3V21.8H36.6V36.5L25.2 21.8H21.5V39.6H24.5V25.6L42.3 48.7Z" fill="currentColor"/></svg>
          </AvatarLogo>
          <AvatarLogo href="#" name="Vue">
            <svg width="45" height="45" viewBox="0 0 61 61" fill="none"><path d="M43.1 13.5H50.1L30.3 47.8L10.4 13.5H24.6L30.3 23.2L35.9 13.5H43.1Z" fill="currentColor"/></svg>
          </AvatarLogo>
        </div>
      </Section>

      <Section title="HeroSection">
        <HeroSection
          title={
            <>
              <span className="block">Build in a weekend</span>
              <span className="block" style={{ color: 'var(--text-brand)' }}>Scale to millions</span>
            </>
          }
          description={<>Supabase is the Postgres development platform.<br className="hidden md:block" /> Start your project with a Postgres database, Authentication, instant APIs, Edge Functions, Realtime subscriptions, Storage, and Vector embeddings.</>}
          primaryCTA={{ label: 'Start your project', href: '#' }}
          secondaryCTA={{ label: 'Request a demo', href: '#' }}
        />
      </Section>

      <Section title="SectionHeader">
        <SectionHeader
          label="Open Source"
          title="Open source from day one"
          description="Supabase is built in the open because we believe great developer tools should be transparent, inspectable, and owned by the community."
        />
      </Section>

      <Section title="Button · Disabled">
        <div className="flex flex-wrap items-center gap-4">
          <Button variant="primary" disabled>Disabled primary</Button>
          <Button variant="default" disabled>Disabled default</Button>
        </div>
      </Section>
    </div>
    </div>
  )
}
