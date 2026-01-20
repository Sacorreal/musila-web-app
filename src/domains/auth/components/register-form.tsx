"use client"

import type React from "react"

import { useAuth } from "@/src/domains/auth/components/auth.context"
import { Button } from "@/src/shared/ui/button"
import { Input } from "@/src/shared/ui/input"
import { Label } from "@/src/shared/ui/label"
import { RadioGroup, RadioGroupItem } from "@/src/shared/ui/radio-group"
import { Eye, EyeOff, Loader2, Mic, Music } from "lucide-react"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

export function RegisterForm() {
  const router = useRouter()
  const { register } = useAuth()
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    lastName: "",
    artisticName: "",
    email: "",
    password: "",
    role: "COMPOSER" as "COMPOSER" | "INTERPRETER",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await register(formData)

    if (error) {
      toast.error("Error al registrarse", {
        description: error,
      })
    } else {
      toast.success("Cuenta creada exitosamente")
      router.push("/app")
    }

    setIsLoading(false)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <Label>¿Qué tipo de artista eres?</Label>
        <RadioGroup
          value={formData.role}
          onValueChange={(value) => setFormData({ ...formData, role: value as "COMPOSER" | "INTERPRETER" })}
          className="grid grid-cols-2 gap-4"
        >
          <div>
            <RadioGroupItem value="COMPOSER" id="composer" className="peer sr-only" />
            <Label
              htmlFor="composer"
              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
            >
              <Music className="mb-2 h-6 w-6" />
              <span className="font-medium">Compositor</span>
              <span className="text-xs text-muted-foreground">Publico canciones</span>
            </Label>
          </div>
          <div>
            <RadioGroupItem value="INTERPRETER" id="interpreter" className="peer sr-only" />
            <Label
              htmlFor="interpreter"
              className="flex flex-col items-center justify-center rounded-xl border-2 border-muted bg-card p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary peer-data-[state=checked]:bg-primary/10 cursor-pointer transition-all"
            >
              <Mic className="mb-2 h-6 w-6" />
              <span className="font-medium">Intérprete</span>
              <span className="text-xs text-muted-foreground">Busco canciones</span>
            </Label>
          </div>
        </RadioGroup>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="name">Nombre</Label>
          <Input
            id="name"
            placeholder="Tu nombre"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
            disabled={isLoading}
            className="bg-card"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="lastName">Apellido</Label>
          <Input
            id="lastName"
            placeholder="Tu apellido"
            value={formData.lastName}
            onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
            disabled={isLoading}
            className="bg-card"
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="artisticName">Nombre artístico (opcional)</Label>
        <Input
          id="artisticName"
          placeholder="Tu nombre artístico"
          value={formData.artisticName}
          onChange={(e) => setFormData({ ...formData, artisticName: e.target.value })}
          disabled={isLoading}
          className="bg-card"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          type="email"
          placeholder="tu@email.com"
          value={formData.email}
          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          required
          disabled={isLoading}
          className="bg-card"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Contraseña</Label>
        <div className="relative">
          <Input
            id="password"
            type={showPassword ? "text" : "password"}
            placeholder="Mínimo 8 caracteres"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
            minLength={8}
            disabled={isLoading}
            className="bg-card pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creando cuenta...
          </>
        ) : (
          "Crear cuenta"
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center">
        Al registrarte, aceptas nuestros{" "}
        <a href="/terms" className="text-primary hover:underline">
          Términos de servicio
        </a>{" "}
        y{" "}
        <a href="/privacy" className="text-primary hover:underline">
          Política de privacidad
        </a>
      </p>
    </form>
  )
}
