"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { INDIA_GEOGRAPHY } from "@/lib/india-data"

interface GeographyValue {
    state: string
    district: string
    block: string
    cluster: string
}

interface Props {
    value: GeographyValue
    onChange: (value: GeographyValue) => void
    disabled?: boolean
}

export function GeographySelector({ value, onChange, disabled }: Props) {
    // Safe defaults if value is null/undefined (though it shouldn't be with correct types)
    const safeValue = (value && typeof value === 'object') ? value : { state: "", district: "", block: "", cluster: "" }

    const [selectedState, setSelectedState] = useState(safeValue.state)
    const [selectedDistrict, setSelectedDistrict] = useState(safeValue.district)
    const [selectedBlock, setSelectedBlock] = useState(safeValue.block)
    const [selectedCluster, setSelectedCluster] = useState(safeValue.cluster)

    const states = INDIA_GEOGRAPHY
    const districts = states.find(s => s.name === selectedState)?.districts || []
    const blocks = districts.find(d => d.name === selectedDistrict)?.blocks || []
    const clusters = blocks.find(b => b.name === selectedBlock)?.clusters || []

    // Sync internal state if prop changes (e.g. from server)
    useEffect(() => {
        if (safeValue.state !== selectedState) setSelectedState(safeValue.state)
        if (safeValue.district !== selectedDistrict) setSelectedDistrict(safeValue.district)
        if (safeValue.block !== selectedBlock) setSelectedBlock(safeValue.block)
        if (safeValue.cluster !== selectedCluster) setSelectedCluster(safeValue.cluster)
    }, [safeValue.state, safeValue.district, safeValue.block, safeValue.cluster])

    const handleStateChange = (state: string) => {
        setSelectedState(state)
        setSelectedDistrict("")
        setSelectedBlock("")
        setSelectedCluster("")
        onChange({ state, district: "", block: "", cluster: "" })
    }

    const handleDistrictChange = (district: string) => {
        setSelectedDistrict(district)
        setSelectedBlock("")
        setSelectedCluster("")
        onChange({ ...safeValue, state: selectedState, district, block: "", cluster: "" })
    }

    const handleBlockChange = (block: string) => {
        setSelectedBlock(block)
        setSelectedCluster("")
        onChange({ ...safeValue, state: selectedState, district: selectedDistrict, block, cluster: "" })
    }

    const handleClusterChange = (cluster: string) => {
        setSelectedCluster(cluster)
        onChange({ ...safeValue, state: selectedState, district: selectedDistrict, block: selectedBlock, cluster })
    }

    return (
        <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-2">
                <Label>State</Label>
                <Select value={selectedState} onValueChange={handleStateChange} disabled={disabled}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select State" />
                    </SelectTrigger>
                    <SelectContent>
                        {states.map((s) => (
                            <SelectItem key={s.name} value={s.name}>{s.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>District</Label>
                <Select value={selectedDistrict} onValueChange={handleDistrictChange} disabled={!selectedState || disabled}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select District" />
                    </SelectTrigger>
                    <SelectContent>
                        {districts.map((d) => (
                            <SelectItem key={d.name} value={d.name}>{d.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Block</Label>
                <Select value={selectedBlock} onValueChange={handleBlockChange} disabled={!selectedDistrict || disabled}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Block" />
                    </SelectTrigger>
                    <SelectContent>
                        {blocks.map((b) => (
                            <SelectItem key={b.name} value={b.name}>{b.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>Cluster</Label>
                <Select value={selectedCluster} onValueChange={handleClusterChange} disabled={!selectedBlock || disabled}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select Cluster" />
                    </SelectTrigger>
                    <SelectContent>
                        {clusters.map((c) => (
                            <SelectItem key={c.name} value={c.name}>{c.name}</SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
        </div>
    )
}
