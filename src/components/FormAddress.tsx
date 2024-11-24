import { Loader2, Search, OctagonAlert, UserRoundCheck, ClipboardPenLine } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter

} from "@/components/ui/dialog"

import { Checkbox } from "./ui/checkbox"
import { ChangeEvent, useRef, useState } from "react"
import { Input } from "./ui/input"
import { Button } from "./ui/button"
import { useToast } from "@/hooks/use-toast"
import { useDataUser } from '@/hooks/useDataUser'

interface PropsCepResponse {
    bairro: string;
    cep: string;
    complemento: string;
    ddd: string;
    estado: string;
    gia: string;
    ibge: string;
    localidade: string;
    logradouro: string;
    regiao: string;
    siafi: string;
    uf: string;
    unidade: string;
}

export function FormAddress() {
    const inputNumberHouse = useRef<HTMLInputElement>(null)
    const { toast } = useToast()
    const { handleSaveData, handleRemoveDataUser, data } = useDataUser()
    const [ isLoading, setIsLoading ] = useState(false)
    const [ cep, setCep ] = useState(data.cep)
    const [ street, setStreet ] = useState(data.street)
    const [ numberHouse, setNumberHouse ] = useState(data.numberHouse)
    const [ city, setCity ] = useState(data.city)
    const [ state, setState ] = useState(data.state)
    const [ name, setName ] = useState(data.name)
    const [ pix, setPix] = useState(data.pix)
    const [ bank, setBank ] = useState(data.bank)
    const [ isChecked, setIsChecked ] = useState(data.isChecked)
    
    async function handleSearchCep() {
        if(isLoading === true) return
        setIsLoading(true);
        
        setTimeout(async () => {
            try {
                const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
                if (!response.ok) {
                    throw new Error("Erro ao buscar o CEP");
                }
                const data: PropsCepResponse = await response.json();
                setStreet(data.logradouro)
                setCity(data.localidade)
                setState(data.estado)
                
                inputNumberHouse.current?.focus()
            } catch {
                toast({
                    variant: 'destructive',
                    title: 'CEP INVÁLIDO',
                    description: 'Tente novamente ou preencha manualmente os campos',
                    action: <OctagonAlert/>
                })

            } finally {
                setIsLoading(false);
            }
        }, 1500); // Adiciona o atraso de 3 segundos
    }

    function handleCepChange(event: ChangeEvent<HTMLInputElement>) {
        const value = event.target.value
        // Remove tudo que não for número
        const onlyNumbers = value.replace(/\D/g, "")
        setCep(onlyNumbers) // Atualiza o estado com apenas números
    }

    function handleChangeChecked(checked: boolean) {
        setIsChecked(checked)
    }

    function handleAddDataUser() {
        if(!cep || !street || !numberHouse || !city || !state || !name || !pix || !bank || isChecked === false) {
            return toast({
                variant: 'destructive',
                title: 'FALTAM DADOS',
                description: 'Preencha todos os campos!',
                action: <OctagonAlert/>
            })
        }

        handleSaveData({
            cep, 
            street, 
            numberHouse, 
            city, 
            state, 
            name, 
            pix, 
            bank, 
            isChecked
        })

        return toast({
            variant: 'default',
            title: 'Dados salvos',
            description: 'Seus dados foram salvos com sucesso!',
            action: <UserRoundCheck/>
        })
    }
   
    function handleRemoveData() {
        setCep ('')
        setStreet ('')
        setNumberHouse ('')
        setCity ('')
        setState ('')
        setName ('')
        setPix('')
        setBank ('')
        setIsChecked(false)

        handleRemoveDataUser()

        return toast({
            variant: 'default',
            title: 'Dados removidos',
            description: 'seus dados foram removidos com sucesso',
            action: <UserRoundCheck/>
        })
    }
    // disable search cep
    const cepToEqualVoid = cep === ''

    // cases to disable of button delete
    const haveDataUser = data.isChecked === false ? true : false

    return (
        <Dialog >
          <DialogTrigger><ClipboardPenLine/></DialogTrigger>
          <DialogContent className="flex flex-col gap-4 p-8">
            <DialogHeader>
              <DialogTitle>Preencha com o seu endereço</DialogTitle>
              <DialogDescription>
                Esses dados são coletados apenas como uma forma de estabelecer confiança entre as partes envolvidas.
              </DialogDescription>
              </DialogHeader>

              <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-4">
                        <Input 
                            type="text"
                            value={cep}
                            onChange={handleCepChange}  // Substituindo oninput por onChange
                            maxLength={8}               // Limita a 8 caracteres
                            placeholder="CEP"
                        />

                        {isLoading === true ?
                            <Button disabled={true}>
                                <Loader2 className="animate-spin" />
                                Loading
                            </Button>
                            :
                            <Button
                                onClick={handleSearchCep}
                                disabled={cepToEqualVoid}
                            > 
                                <Search/>
                            </Button>
                        }
                    </div>
                    
                    <div className="flex gap-4">
                        <Input placeholder="Rua" value={street} onChange={(e) => setStreet(e.target.value)}/>
                        <Input 
                            placeholder="Número" 
                            value={numberHouse} 
                            onChange={(e) => setNumberHouse(e.target.value)} 
                            className="w-20"
                            ref={inputNumberHouse}
                        />
                    </div>
                    

                    <div className="flex items-center gap-4">
                        <Input placeholder="Cidade" value={city} onChange={(e) => setCity(e.target.value)}/>
                        <Input placeholder="Estado" value={state} onChange={(e) => setState(e.target.value)}/>
                    </div>
              </div>
            <DialogHeader>
                <DialogTitle>
                    Preencha com seus dados pessoais
                </DialogTitle>
                <DialogDescription>
                    Esses dados estão sendo coletados para uma futura negociação de empréstimo
                </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4">
                <Input placeholder="Seu Nome e sobrenome (referente a chave pix)" value={name} onChange={(e) => setName(e.target.value)}/>
                <div className="flex gap-4 items-center">
                    <Input placeholder="Seu Pix" value={pix} onChange={(e) => setPix(e.target.value)}/>
                    <Input placeholder="Seu Banco" value={bank} onChange={(e) => setBank(e.target.value)}/>
                </div>

                <div className="items-top flex space-x-2">
                    <Checkbox 
                        id="terms1" 
                        checked={isChecked}
                        onCheckedChange={handleChangeChecked} 
                    />
                    <div className="grid gap-1.5 leading-none">
                        <label
                        htmlFor="terms1"
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                            Aceite os termos e condições
                        </label>
                        <p className="text-sm text-muted-foreground">
                            Você concorda com os meus Termos de Serviço e Política de Privacidade.
                        </p>
                    </div>
                </div>
            </div>
            <DialogFooter>
                <div className="w-full flex flex-col gap-4">
                    <Button 
                        disabled={cepToEqualVoid}
                        onClick={handleAddDataUser}
                        variant='default' 
                    >
                        Salvar
                    </Button>

                    <Button 
                        disabled={haveDataUser}
                        variant='destructive' 
                        onClick={handleRemoveData}
                    >
                        Deletar
                    </Button>
                </div>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    )
}