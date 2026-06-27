package org.example.mapper;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import javax.annotation.processing.Generated;
import org.example.dtos.response.ConciliationResponse;
import org.example.enums.CitationStatus;
import org.example.models.Associate;
import org.example.models.Conciliation;
import org.example.models.User;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-06-22T21:10:02-0300",
    comments = "version: 1.5.5.Final, compiler: Eclipse JDT (IDE) 3.46.0.v20260407-0427, environment: Java 21.0.10 (Eclipse Adoptium)"
)
@Component
public class ConciliationMapperImpl implements ConciliationMapper {

    @Override
    public ConciliationResponse toResponse(Conciliation conciliation) {
        if ( conciliation == null ) {
            return null;
        }

        Long associateId = null;
        String associateName = null;
        Long internId = null;
        String internName = null;
        Long id = null;
        String oppositePartyName = null;
        String oppositePartyContact = null;
        LocalDateTime audienceDateTime = null;
        String summary = null;
        CitationStatus citationStatus = null;
        LocalDateTime createdAt = null;

        associateId = conciliationAssociateId( conciliation );
        associateName = conciliationAssociateName( conciliation );
        internId = conciliationInternId( conciliation );
        internName = conciliationInternName( conciliation );
        id = conciliation.getId();
        oppositePartyName = conciliation.getOppositePartyName();
        oppositePartyContact = conciliation.getOppositePartyContact();
        audienceDateTime = conciliation.getAudienceDateTime();
        summary = conciliation.getSummary();
        citationStatus = conciliation.getCitationStatus();
        createdAt = conciliation.getCreatedAt();

        ConciliationResponse conciliationResponse = new ConciliationResponse( id, oppositePartyName, oppositePartyContact, audienceDateTime, summary, citationStatus, associateId, associateName, internId, internName, createdAt );

        return conciliationResponse;
    }

    @Override
    public List<ConciliationResponse> toResponseList(List<Conciliation> conciliations) {
        if ( conciliations == null ) {
            return null;
        }

        List<ConciliationResponse> list = new ArrayList<ConciliationResponse>( conciliations.size() );
        for ( Conciliation conciliation : conciliations ) {
            list.add( toResponse( conciliation ) );
        }

        return list;
    }

    private Long conciliationAssociateId(Conciliation conciliation) {
        if ( conciliation == null ) {
            return null;
        }
        Associate associate = conciliation.getAssociate();
        if ( associate == null ) {
            return null;
        }
        Long id = associate.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String conciliationAssociateName(Conciliation conciliation) {
        if ( conciliation == null ) {
            return null;
        }
        Associate associate = conciliation.getAssociate();
        if ( associate == null ) {
            return null;
        }
        String name = associate.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }

    private Long conciliationInternId(Conciliation conciliation) {
        if ( conciliation == null ) {
            return null;
        }
        User intern = conciliation.getIntern();
        if ( intern == null ) {
            return null;
        }
        Long id = intern.getId();
        if ( id == null ) {
            return null;
        }
        return id;
    }

    private String conciliationInternName(Conciliation conciliation) {
        if ( conciliation == null ) {
            return null;
        }
        User intern = conciliation.getIntern();
        if ( intern == null ) {
            return null;
        }
        String name = intern.getName();
        if ( name == null ) {
            return null;
        }
        return name;
    }
}
