import { supabase } from '@/supabaseClient'

export default {
  name: 'AuthComponent',
  data() {
    return {
      currentForm: 'login',
      showPassword: false,
      fullname: '',
      email: '',
      phone_number: '',
      password: '',
      confirmPassword: '',
      loginEmail: '',
      loginPassword: '',
      rememberMe: false,
      snackbar: false,
      snackbarText: '',
      snackbarColor: '',
      rules: {
        required: (v) => !!v || 'This field is required',
        fullname: (v) => (v && v.length >= 10) || 'Name should be at least 10 characters long',
        email: (v) => /.+@.+\..+/.test(v) || 'E-mail must be valid',
        phone: (v) =>
          (v && v.length === 11 && /^\d+$/.test(v)) || 'Phone number should be 11 digits',
        password: (v) =>
          (v &&
            v.length >= 8 &&
            /[A-Z]/.test(v) &&
            /[a-z]/.test(v) &&
            /[0-9]/.test(v) &&
            /[!@#$%^&*(),.?":{}|<>]/.test(v)) ||
          'Password must be at least 8 characters and contain uppercase, lowercase, number, and special character',
      },
    }
  },
  methods: {
    showSnackbar(text, color) {
      this.snackbarText = text
      this.snackbarColor = color
      this.snackbar = true
    },
    async handleSubmit(formType) {
      if (formType === 'login') {
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email: this.loginEmail,
            password: this.loginPassword,
          })

          if (error) throw error

          if (!data.session) {
            throw new Error('No session returned from login.')
          }

          localStorage.setItem('access_token', data.session.access_token)
          localStorage.setItem('refresh_token', data.session.refresh_token)

          if (this.rememberMe) {
            localStorage.setItem('email', this.loginEmail)
            localStorage.setItem('password', this.loginPassword)
          } else {
            localStorage.removeItem('email')
            localStorage.removeItem('password')
          }

          this.showSnackbar('Login successful!', 'success')
          // Redirect to home page after successful signup
          this.$router.push('/home')
        } catch (error) {
          console.error('Login error:', error)
          this.showSnackbar(`Login error: ${error.message}`, 'error')
        }
      } else if (formType === 'signup') {
        if (this.password !== this.confirmPassword) {
          this.showSnackbar('Passwords do not match', 'error')
          return
        }

        try {
          const { data, error } = await supabase.auth.signUp({
            email: this.email,
            password: this.password,
          })

          if (error) throw error

          const user_id = data.user?.id
          if (!user_id) throw new Error('Failed to get user ID during signup.')

          const { error: insertError } = await supabase.from('users_info').insert([
            {
              fullname: this.fullname,
              id: user_id,
              email_address: this.email,
              phone_number: this.phone_number,
            },
          ])

          if (insertError) throw new Error('Unable to save user details to the database.')

          this.showSnackbar('Signup successful please check your email!', 'success')
          // Redirect to home page after successful signup
          this.$router.push('/home')

          // Clear form fields after successful signup
          this.fullname = ''
          this.email = ''
          this.phone_number = ''
          this.password = ''
          this.confirmPassword = ''
        } catch (error) {
          console.error('Signup error:', error)
          this.showSnackbar(`Signup error: ${error.message}`, 'error')
        }
      }
    },
  },
  mounted() {
    const savedEmail = localStorage.getItem('email')
    const savedPassword = localStorage.getItem('password')
    if (savedEmail && savedPassword) {
      this.loginEmail = savedEmail
      this.loginPassword = savedPassword
      this.rememberMe = true
    }
  },
}
