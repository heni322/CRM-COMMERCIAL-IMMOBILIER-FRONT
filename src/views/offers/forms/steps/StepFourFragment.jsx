import React, { useRef } from 'react'
import { useState } from 'react'
import CustomCurrency from 'src/components/CustomCurrency'

const ContentEditableWithRef = props => {
  const defaultValue = useRef(props.value)

  const handleInput = event => {
    if (props.onChange) {
      props.onChange(event)
    }
  }

  return (
    <div
      contentEditable={props?.disabled}
      style={props?.style}
      onInput={handleInput}
      dangerouslySetInnerHTML={{ __html: defaultValue.current }}
    />
  )
}

const StepFourFragment = ({ contratSkeletonLocalData, setContratSkeletonLocalData, isSuccess, isFetching }) => {
  // Normalize the skeleton to an array so the page never crashes when it is
  // still undefined (the parent sets it in a useEffect after the query resolves).
  const skeleton = Array.isArray(contratSkeletonLocalData) ? contratSkeletonLocalData : []

  return (
    <>
      {isSuccess && !isFetching ? (
        <div className='mt-11 pl-5'>
          {skeleton.length === 0 && (
            <div className='flex justify-center items-center mt-10 text-gray-500'>
              Aucune donnée de contrat à afficher.
            </div>
          )}
          {skeleton.map(item => {
            return (
              <div
                key={item?.id}
                style={{
                  marginBottom: 40
                }}
              >
                <h3>{item?.title}</h3>

                {item?.fields?.map(field => {
                  // Properties may arrive either as field.data.properties (object shape)
                  // or directly as field.data (array shape). Support both so the
                  // selected biens always render.
                  const properties = Array.isArray(field?.data?.properties)
                    ? field.data.properties
                    : Array.isArray(field?.data)
                    ? field.data
                    : []
                  const fees = field?.data?.fees ?? {}

                  return (
                    <div
                      key={field?.id}
                      style={{
                        marginBottom: 20
                      }}
                    >
                      {['text', 'table', 'image'].includes(field?.type) &&
                        typeof field?.data === 'string' && (
                          <ContentEditableWithRef
                            disabled={!field?.data.includes('disabled')}
                            value={field?.data}
                            onChange={e => {
                              const editorFieldData = e.currentTarget.innerHTML
                              setContratSkeletonLocalData(d => {
                                return skeleton?.map(e => {
                                  if (e?.id == item?.id) {
                                    const tempD = {
                                      ...e,
                                      fields: e?.fields?.map(fieldd => {
                                        if (fieldd?.id == field?.id) {
                                          return { ...fieldd, data: editorFieldData }
                                        }

                                        return fieldd
                                      })
                                    }

                                    return tempD
                                  }

                                  return e
                                })
                              })
                            }}
                            style={{
                              padding: 10,
                              border: '1px solid #a1a1a1',
                              borderRadius: 10,
                              boxShadow:
                                '0px 2px 1px -1px rgba(0,0,0,0.2),0px 1px 1px 0px rgba(0,0,0,0.14),0px 1px 3px 0px rgba(0,0,0,0.12)'
                            }}
                          />
                        )}

                      {/* Showing Properties (selected biens) */}
                      <div className=''>
                        {['properties'].includes(field?.type) && (
                          <div className='grid  gap-4 justify-self-center my-4'>
                            <strong>Liste des biens</strong>
                            {properties.length === 0 ? (
                              <div className='text-gray-500 py-4'>Aucun bien sélectionné.</div>
                            ) : (
                              <table className='min-w-full divide-y divide-gray-200'>
                                <thead className='bg-gray-50'>
                                  <tr>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Référence
                                    </th>
                                    <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Intitulé
                                    </th>
                                    <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Prix Unitaire HT
                                    </th>
                                    <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Montant TVA
                                    </th>
                                    <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                      Montant TTC
                                    </th>
                                  </tr>
                                </thead>
                                <tbody className='bg-white divide-y divide-gray-200'>
                                  {properties.map((property, indexCurrent) => (
                                    <tr key={indexCurrent}>
                                      <td className='px-6 py-2 whitespace-nowrap text-sm'>
                                        {property?.reference_property}
                                      </td>
                                      <td className='px-6 py-2 whitespace-nowrap text-sm'>
                                        {property?.entitled_property}
                                      </td>
                                      <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                        <CustomCurrency
                                          value={property?.price_unitaire_HT ?? 0}
                                          allowNegative={false}
                                        />
                                      </td>
                                      <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                        <CustomCurrency value={property?.amount_TVA ?? 0} allowNegative={false} />
                                      </td>
                                      <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                        <CustomCurrency
                                          value={property?.price_unitaire_TTC ?? 0}
                                          allowNegative={false}
                                        />
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            )}
                            <strong>Total des frais</strong>
                            <table className='min-w-full divide-y divide-gray-200'>
                              <thead className='bg-gray-50'>
                                <tr>
                                  <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    CPF
                                  </th>
                                  <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Frais d'inscription
                                  </th>
                                  <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Frais complémentaires d'inscription
                                  </th>
                                  <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Frais de lotissement
                                  </th>
                                  <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Frais de syndic
                                  </th>
                                  <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Frais de dossier
                                  </th>
                                  <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Frais d'avocat
                                  </th>
                                  <th className='hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
                                    Autres frais
                                  </th>
                                </tr>
                              </thead>
                              <tbody className='bg-white divide-y divide-gray-200'>
                                <tr>
                                  <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                    <CustomCurrency value={fees?.cpf_total ?? 0} allowNegative={false} />
                                  </td>
                                  <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                    <CustomCurrency value={fees?.registration_fees_total ?? 0} allowNegative={false} />
                                  </td>
                                  <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                    <CustomCurrency
                                      value={fees?.registration_fees_compl_total ?? 0}
                                      allowNegative={false}
                                    />
                                  </td>
                                  <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                    <CustomCurrency value={fees?.lotiss_fees_total ?? 0} allowNegative={false} />
                                  </td>
                                  <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                    <CustomCurrency value={fees?.trustee_fees_total ?? 0} allowNegative={false} />
                                  </td>
                                  <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                    <CustomCurrency value={fees?.folder_fees_total ?? 0} allowNegative={false} />
                                  </td>
                                  <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                    <CustomCurrency value={fees?.lawyer_fees_total ?? 0} allowNegative={false} />
                                  </td>
                                  <td className='hidden sm:table-cell px-6 py-2 whitespace-nowrap text-sm'>
                                    <CustomCurrency value={fees?.others_fees_total ?? 0} allowNegative={false} />
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}
        </div>
      ) : (
        <div class='flex justify-center items-center mt-10'>
          <div class='animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-900'></div>
        </div>
      )}
    </>
  )
}

export default StepFourFragment
